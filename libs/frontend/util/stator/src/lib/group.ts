/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, distinctUntilChanged, map, of, shareReplay, switchMap, tap, take } from "rxjs";
import { TimeDuration, objUtil, parseDuration } from "@pestras/shared/util";
import { UpdateMode } from "./types";
import { gate } from './util';

export abstract class StatorGroupState<T extends Record<string, any> = any> {

  private readonly _data = new BehaviorSubject<Map<string | null, T>>(new Map<string, T>());
  private readonly _exp!: number | null;
  private readonly _groupsTiming = new Map<string | null, number>();
  private readonly _loading!: BehaviorSubject<boolean>;
  private readonly _not_found: Record<string, Date> = {};

  public readonly loading$!: Observable<boolean>;

  constructor(
    public readonly name: string,
    protected readonly key: keyof T,
    protected readonly groupBy: keyof T,
    exp: TimeDuration | null = null,
    isLoading = false
  ) {

    this._loading = new BehaviorSubject<boolean>(isLoading);
    this.loading$ = this._loading.pipe(distinctUntilChanged());

    this._exp = exp ? parseDuration(exp) : null;

  }

  // loading
  // -------------------------------------------------------------------------------------
  protected _setLoading(state = true) {
    this._loading.next(state);
  }

  private _id(doc: T) {
    return doc[this.key] as string;
  }

  protected _init() {
    setInterval(() => {

      for (const [group, time] of this._groupsTiming) {
        if (this._exp && Date.now() > time + this._exp)
          this._fetchGroup(group)
            .subscribe({
              next: list => {
                const dataMap = this._data.getValue();

                // remove old docs
                for (const doc of dataMap.values())
                  if (doc[this.groupBy] === group)
                    dataMap.delete(this._id(doc));

                for (const doc of list)
                  dataMap.set(this._id(doc), doc);

                this._groupsTiming.set(group, Date.now());
                this._data.next(dataMap);
              },
              error: err => {
                console.error(`error fetching ${this.name} group of ${group}`)
                console.error(err);
              }
            });
      }

    }, 60000);
  }


  // abstract
  // -------------------------------------------------------------------------------------
  protected abstract _fetchGroup(group: string | null): Observable<T[]>;

  protected abstract _fetch(key: string): Observable<T | null>;



  // protected
  // -------------------------------------------------------------------------------------
  protected _insert(doc: T) {

    const dataMap = this._data.getValue();

    if (!doc || !this._id(doc) || !doc[this.groupBy])
      return;

    this.selectGroup(doc[this.groupBy] as string)
      .pipe(take(1))
      .subscribe(() => {
        const newDoc = objUtil.freezeObj(objUtil.cloneObject(doc));

        dataMap.set(this._id(doc), newDoc);
        this._data.next(dataMap);
      });
  }


  protected _insertGroup(group: string | null, docs: T[]) {
    const dataMap = this._data.getValue();

    if (docs.length === 0)
      return;

    // empty group
    for (const doc of dataMap.values())
      if (doc[this.groupBy] === group)
        dataMap.delete(this._id(doc));

    // insert new docs
    for (const doc of docs) {
      const newDoc = objUtil.freezeObj(objUtil.cloneObject(doc));
      dataMap.set(this._id(doc), newDoc);
    }

    this._groupsTiming.set(group, Date.now());

    this._data.next(dataMap);
  }


  protected _update(id: string, update: Partial<T>, mode?: UpdateMode): void
  protected _update(id: string, compute: (doc: T) => T): void
  protected _update(id: string, update: Partial<T> | ((doc: T) => T), mode: UpdateMode = 'merge') {
    const dataMap = this._data.getValue();
    const curr = objUtil.cloneObject(dataMap.get(id as string));

    if (!curr)
      return;

    let newDoc: T;

    if (typeof update === 'function') {
      newDoc = update(curr);
    } else {
      newDoc = mode === 'replace'
        ? { ...update, [this.key]: this._id(curr) }
        : mode === 'merge'
          ? objUtil.merge(curr, update)
          : objUtil.deepMerge(curr, update);
    }

    newDoc = objUtil.freezeObj(objUtil.cloneObject(newDoc));
    dataMap.set(this._id(curr), newDoc);

    this._data.next(dataMap);
  }


  protected _upsert(doc: T, mode: UpdateMode = 'replace') {
    if (!this._id(doc))
      return;

    const dataMap = this._data.getValue();

    if (dataMap.get(this._id(doc)))
      this._update(this._id(doc), doc, mode);
    else
      this._insert(doc);
  }


  protected _delete(id: string) {
    const dataMap = this._data.getValue();
    const doc = dataMap.get(id);

    if (!doc)
      return;

    dataMap.delete(id);

    const group = doc[this.groupBy] as string;

    if (this.getGroup(group).length === 0)
      this._groupsTiming.delete(group);

    this._data.next(dataMap);
  }


  protected _deleteGroup(group: string | null) {
    const dataMap = this._data.getValue();
    const ids: string[] = [];

    for (const doc of dataMap.values())
      if (doc[this.groupBy] === group) {
        ids.push(this._id(doc));
        dataMap.delete(this._id(doc));
      }

    this._groupsTiming.delete(group);
    this._data.next(dataMap);
  }


  protected _clear() {
    this._data.next(new Map());
    this._groupsTiming.clear();
  }




  // getters
  // -------------------------------------------------------------------------------------
  has(id: string) {
    return this._data.getValue().has(id);
  }

  hasGroup(group: string | null) {
    return this._groupsTiming.has(group);
  }

  get(id: string) {
    return this._data.getValue().get(id) ?? null;
  }

  getGroup(group: string | null) {
    return Array.from(this._data.getValue().values())
      .filter(doc => doc[this.groupBy] === group);
  }

  getMany(ids: string[]): T[];
  getMany(filter: (doc: T) => boolean): T[];
  getMany(filter: string[] | ((doc: T) => boolean)): T[] {
    const data = this._data.getValue();

    if (Array.isArray(filter))
      return filter.map(id => data.get(id)).filter(Boolean) as T[];

    const docs: T[] = [];

    for (const doc of data.values())
      if (filter(doc))
        docs.push(doc);

    return docs;
  }

  select(id: string, group?: string | null): Observable<T | null>;
  select(filter: (doc: T) => boolean): Observable<T | null>;
  select(filter: string | ((doc: T) => boolean), group?: string | null): Observable<T | null> {

    if (typeof filter === 'function') {
      return this._data.pipe(map(map => {
        for (const doc of map.values())
          if (filter(doc))
            return doc;

        return null;
      }));
    }

    if (filter && group)
      return this.selectGroup(group)
        .pipe(map(() => this.get(filter)))

    if (this._exp && this._not_found[filter] && (Date.now() - this._not_found[filter].getTime() < this._exp))
      return of(null);

    return this._data.pipe(
      gate(this.loading$, true),
      switchMap(data => {
        if (data.get(filter))
          return of(data.get(filter) ?? null);

        return this._fetch(filter)
          .pipe(map(doc => {
            if (!doc) {
              this._not_found[filter] = new Date();
              return null;
            }

            delete this._not_found[filter];

            if (!this._groupsTiming.has(doc[this.groupBy] as string))
              this.selectGroup(doc[this.groupBy] as string)
                .pipe(take(1))
                .subscribe();

            return doc;
          }));
      })
    );
  }

  selectGroup(group: string | null): Observable<T[]> {
    if (this._groupsTiming.has(group))
      return this._data.pipe(
        gate(this.loading$, true),
        map(data => {
          return Array.from(data.values())
            .filter(doc => doc[this.groupBy] === group);
        }),
        shareReplay(1)
      );

    return this._fetchGroup(group)
      .pipe(
        tap(list => {
          const dataMap = this._data.getValue();

          for (const doc of list ?? [])
            dataMap.set(this._id(doc), objUtil.freezeObj(objUtil.cloneObject(doc)));

          this._groupsTiming.set(group, Date.now());

          this._data.next(dataMap);
        }),
        switchMap(() => this.selectGroup(group))
      );
  }

  selectMany(ids: string[]): Observable<T[]>;
  selectMany(filter: (doc: T) => boolean): Observable<T[]>;
  selectMany(filter: string[] | ((doc: T) => boolean)): Observable<T[]> {
    return this._data
      .pipe(map(() => this.getMany(filter as string[])));
  }
} 