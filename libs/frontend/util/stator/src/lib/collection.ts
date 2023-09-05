/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, distinctUntilChanged, map, shareReplay, tap } from "rxjs";
import { TimeDuration, objUtil, parseDuration } from "@pestras/shared/util";
import { Filter, Query, UpdateMode } from "./types";
import { gate } from './util';

export abstract class StatorCollectionState<T extends Record<string, any> = any> {

  private readonly _data = new BehaviorSubject(new Map<string, T>());
  private readonly _loading!: BehaviorSubject<boolean>;
  private readonly exp!: number;
  private _timer: any = null;

  public readonly data$!: Observable<T[]>;
  public readonly loading$!: Observable<boolean>;
  public readonly count$!: Observable<number>;

  constructor(
    public readonly name: string,
    protected readonly key: keyof T,
    exp: TimeDuration | null = null,
    isLoading = false
  ) {

    this._loading = new BehaviorSubject<boolean>(isLoading);
    this.loading$ = this._loading.pipe(distinctUntilChanged());

    this.exp = exp ? parseDuration(exp) : 0;

    this.count$ = this._data.pipe(map(dataMap => dataMap.size), distinctUntilChanged(), shareReplay(1));
    this.data$ = this._data.pipe(
      gate(this.loading$, true),
      map(map => Array.from(map.values())),
      shareReplay(1)
    );
  }

  // loading
  // -------------------------------------------------------------------------------------
  protected _setLoading(state = true) {
    this._loading.next(state);
  }



  private _id(doc: T) {
    return doc[this.key] as string;
  }



  private _arrayToMap(list: T[]) {
    const dataMap = new Map<string, T>();

    for (const doc of list)
      dataMap.set(this._id(doc), doc);

    return dataMap;
  }

  private _dataMap() {
    return this._data.getValue();
  }




  // abstract
  // -------------------------------------------------------------------------------------
  protected abstract _load(...args: any[]): Observable<T[]>;

  private _refresh(...args: any[]) {
    this._load(...args)
      .pipe(tap(list => this._data.next(this._arrayToMap(list))))
      .subscribe(() => console.log(`${this.name} store refreshed`))
  }



  protected _init(...args: any[]) {
    if (this._timer)
      clearInterval(this._timer);

    this._refresh(...args);
    this._timer = setInterval(() => this._refresh(...args), this.exp);
  }



  // map
  // -------------------------------------------------------------------------------------
  protected _mapItemValue(doc: T) {
    return objUtil.freezeObj(objUtil.cloneObject(doc));
  }




  // getters
  // -------------------------------------------------------------------------------------
  get data() {
    return Array.from(this._data.getValue().values());
  }

  get count() {
    return this._data.getValue().size;
  }


  get(id: string): T | null
  get(quary: Query<T>): T | null
  get(filter: Filter<T>): T | null
  get(id: string | Query<T> | Filter<T>) {
    if (!id)
      return null;

    if (typeof id === 'string')
      return this._dataMap().get(id)

    if (typeof id === "function") {
      for (const doc of this._dataMap().values())
        if (id(doc))
          return doc;

      return null;
    }

    for (const doc of this._dataMap().values()) {
      let match = true;
      for (const prop in id) {
        if (doc[prop] !== id[prop]) {
          match = false;
          break;
        }
      }

      if (match)
        return doc;
    }

    return null;
  }

  getMany(ids: string[]): T[];
  getMany(quary: Query<T>): T[];
  getMany(filter: Filter<T>): T[];
  getMany(filter: string[] | Query<T> | Filter<T>): T[] {
    const docs: T[] = [];
    const map = this._dataMap();

    if (Array.isArray(filter)) {
      for (const id of filter) {
        const doc = map.get(id);

        if (id && doc)
          docs.push(doc);
      }

    } else if (typeof filter === "function") {
      for (const doc of map.values())
        if (filter(doc))
          docs.push(doc);

    } else {
      for (const doc of this._dataMap().values()) {
        let match = true;
        for (const prop in filter) {
          if (doc[prop] !== filter[prop]) {
            match = false;
            break;
          }
        }

        if (match)
          docs.push(doc);
      }

    }

    return docs;
  }




  // selectors
  // -------------------------------------------------------------------------------------
  select(id: string): Observable<T | null>;
  select(quary: Query<T>): Observable<T | null>;
  select(filter: Filter<T>): Observable<T | null>;
  select(id: string | Query<T> | Filter<T>) {

    return this.data$.pipe(
      map(() => this.get(id as string)),
      shareReplay(1)
    );
  }

  selectMany(ids: string[]): Observable<T[]>;
  selectMany(quary: Query<T>): Observable<T[]>;
  selectMany(filter: Filter<T>): Observable<T[]>;
  selectMany(filter: string[] | Query<T> | Filter<T>): Observable<T[]> {

    return this.data$.pipe(
      map(() => this.getMany(filter as string[])),
      shareReplay(1)
    );
  }




  // set
  // -------------------------------------------------------------------------------------
  protected _set(docs: T[]) {
    this._data.next(this._arrayToMap(docs));
  }



  // insert
  // -------------------------------------------------------------------------------------
  protected _insert(doc: T) {
    const dataMap = this._data.getValue();

    if (!doc || !this._id(doc) || dataMap.has(this._id(doc)))
      return;

    const newDoc = this._mapItemValue(doc);
    dataMap.set(this._id(doc), newDoc);

    this._data.next(dataMap);
  }

  protected _insertMany(docs: T[]) {
    if (docs.length === 0)
      return;

    const dataMap = this._dataMap();
    const insertedDocs: T[] = [];

    for (const doc of docs) {
      if (!this._id(doc) || dataMap.has(this._id(doc)))
        continue;

      const newDoc = this._mapItemValue(doc);
      dataMap.set(this._id(doc), newDoc);
      insertedDocs.push(newDoc);
    }

    this._data.next(dataMap);
  }



  // upsert
  // -------------------------------------------------------------------------------------
  protected _upsert(doc: T, mode: UpdateMode = 'replace') {
    if (!this._id(doc))
      return;

    if (this.get(this._id(doc)))
      this._update(this._id(doc), doc, mode);
    else
      this._insert(doc);
  }

  protected _upsertMany(docs: T[], mode: UpdateMode = 'replace') {
    const dataMap = this._dataMap();
    const toInsert: T[] = [];
    const toUpdate: T[] = [];
    const updated: T[] = [];

    for (const doc of docs) {
      if (!this._id(doc))
        continue;

      if (dataMap.has(this._id(doc)))
        toUpdate.push(doc)
      else
        toInsert.push(doc);
    }

    if (!toUpdate.length)
      return;

    for (const doc of toUpdate) {
      const curr = objUtil.cloneObject(dataMap.get(this._id(doc)));
      let newDoc = mode === "replace" ? doc : mode === 'merge' ? objUtil.merge(curr, doc) : objUtil.deepMerge(curr, doc);
      newDoc = this._mapItemValue(newDoc);
      dataMap.set(this._id(newDoc), newDoc);
      updated.push(newDoc);
    }

    this._insertMany(toInsert);
  }



  // update
  // -------------------------------------------------------------------------------------
  protected _update(id: string, update: Partial<T>, mode?: UpdateMode): void
  protected _update(filter: (doc: T) => boolean, update: Partial<T>, mode?: UpdateMode): void
  protected _update(id: string, compute: (doc: T) => T): void
  protected _update(filter: (doc: T) => boolean, compute: (doc: T) => T): void
  protected _update(id: string | ((doc: T) => boolean), update: Partial<T> | ((doc: T) => T), mode: UpdateMode = 'merge') {
    const curr = objUtil.cloneObject(this.get(id as string));
    const dataMap = this._dataMap();

    if (!curr)
      return;

    let newDoc: T;

    if (typeof update === 'function') {
      newDoc = update(curr);
    } else {
      newDoc = mode === 'replace' ? { ...update, [this.key]: this._id(curr) } : mode === 'merge' ? objUtil.merge(curr, update) : objUtil.deepMerge(curr, update);
    }

    newDoc = this._mapItemValue(newDoc);
    dataMap.set(this._id(curr), newDoc);

    this._data.next(dataMap);
  }

  protected _updateMany(ids: string[], update: Partial<T>, mode?: UpdateMode): void;
  protected _updateMany(filter: (doc: T) => boolean, update: Partial<T>, mode?: UpdateMode): void;
  protected _updateMany(ids: string[], compute: (doc: T) => T): void;
  protected _updateMany(filter: (doc: T) => boolean, compute: (doc: T) => T): void;
  protected _updateMany(filter: string[] | ((doc: T) => boolean), update: Partial<T> | ((doc: T) => T), mode: UpdateMode = 'merge'): void {
    const map = this._dataMap();
    const docs = this.getMany(filter as string[]);

    if (docs.length === 0)
      return;

    if (typeof update === 'function') {
      for (const doc of docs) {
        const newDoc = this._mapItemValue(update(objUtil.cloneObject(doc)));
        map.set(this._id(doc), newDoc);
      }
    } else {
      for (const doc of docs) {
        const newDoc = mode === 'replace'
          ? this._mapItemValue({ ...update as T, [this.key]: this._id(doc) })
          : this._mapItemValue(mode === 'merge'
            ? objUtil.merge(objUtil.cloneObject(doc), update)
            : objUtil.deepMerge(objUtil.cloneObject(doc), update));

        map.set(this._id(doc), newDoc);
      }
    }

    this._data.next(map);
  }



  // delete
  // -------------------------------------------------------------------------------------
  protected _delete(id: string) {
    const dataMap = this._dataMap();
    const doc = dataMap.get(id);

    if (!doc)
      return;

    dataMap.delete(id);

    this._data.next(dataMap);
  }


  protected _deleteMany(ids: string[]): void;
  protected _deleteMany(filter: (doc: T) => boolean): void;
  protected _deleteMany(filter: string[] | ((doc: T) => boolean)) {
    const dataMap = this._dataMap();
    const docs = this.getMany(filter as string[]);

    if (docs.length === 0)
      return;

    for (const doc of docs) {
      dataMap.delete(this._id(doc));
    }

    this._data.next(dataMap);
  }




  // clear
  // -------------------------------------------------------------------------------------
  protected _clear() {
    this._data.next(new Map());
    this._timer && clearTimeout(this._timer);
    this._timer = null;
  }
}