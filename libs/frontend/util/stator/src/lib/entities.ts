/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, distinctUntilChanged, map, shareReplay, switchMap, tap } from "rxjs";
import { TimeDuration, objUtil, parseDuration } from "@pestras/shared/util";
import { UpdateMode } from "./types";
import { gate } from './util';

export abstract class StatorEntitiesState<T extends Record<string, any> = any> {

  private readonly _data!: BehaviorSubject<Map<string, { expAt: number; doc: T, group?: string }>>;
  private readonly _exp!: number;
  private readonly _loading!: BehaviorSubject<boolean>;

  public readonly loading$!: Observable<boolean>;

  constructor(
    public readonly name: string,
    protected readonly key: keyof T,
    exp: TimeDuration | null = null,
    isLoading = false
  ) {

    this._loading = new BehaviorSubject<boolean>(isLoading);
    this.loading$ = this._loading.pipe(distinctUntilChanged());

    this._data = new BehaviorSubject<Map<string, { expAt: number; doc: T, group?: string }>>(new Map());
    this._exp = parseDuration(exp ?? ['1h']);
  }

  // loading
  // -------------------------------------------------------------------------------------
  protected _setLoading(state = true) {
    this._loading.next(state);
  }


  private _dataMap() {
    return this._data.getValue();
  }

  private _id(doc: T) {
    return doc[this.key] as string;
  }



  // abstract
  // -------------------------------------------------------------------------------------
  protected abstract _fetch(id: string, group?: string): Observable<T | null>;



  // protected
  // -------------------------------------------------------------------------------------
  protected _insert(doc: T, group?: string) {
    const dataMap = this._data.getValue();

    if (!doc || !this._id(doc) || dataMap.has(this._id(doc)))
      return;

    const newDoc = objUtil.freezeObj(objUtil.cloneObject(doc));
    dataMap.set(this._id(doc), { expAt: Date.now() + this._exp, doc: newDoc, group });

    this._data.next(dataMap);
  }


  protected _update(id: string, update: Partial<T>, mode?: UpdateMode): void
  protected _update(id: string, compute: (doc: T) => T): void
  protected _update(id: string, update: Partial<T> | ((doc: T) => T), mode: UpdateMode = 'merge') {
    const dataMap = this._dataMap();
    const curr = objUtil.cloneObject(dataMap.get(id as string)?.doc);

    if (!curr)
      return;

    let newDoc: T;

    if (typeof update === 'function') {
      newDoc = { ...update(curr), [this.key]: this._id(curr) };
    } else {
      newDoc = mode === 'replace'
        ? { ...update }
        : mode === 'merge'
          ? objUtil.merge(curr, update)
          : objUtil.deepMerge(curr, update);
    }

    newDoc = objUtil.freezeObj(objUtil.cloneObject(newDoc));
    dataMap.set(this._id(curr), { expAt: Date.now() + this._exp, doc: newDoc });

    this._data.next(dataMap);
  }


  protected _upsert(doc: T, mode: UpdateMode = 'replace', group?: string) {
    if (!this._id(doc))
      return;

    const dataMap = this._dataMap();

    if (dataMap.get(this._id(doc)))
      this._update(this._id(doc), doc, mode);
    else
      this._insert(doc, group);
  }


  protected _delete(id: string) {
    const dataMap = this._dataMap();
    const doc = dataMap.get(id)?.doc;

    if (!doc)
      return;

    dataMap.delete(id);

    this._data.next(dataMap);
  }


  protected _clear() {
    this._data.next(new Map());
  }




  // selectors
  // -------------------------------------------------------------------------------------
  get(id: string) {
    return this._dataMap().get(id)?.doc ?? null;
  }

  select(id: string, group?: string) {
    const dataMap = this._dataMap();
    const doc = dataMap.get(id) ?? null;

    if (!doc || doc.expAt < Date.now())
      return this._fetch(id, group).pipe(
        tap(doc => {
          if (doc) {
            dataMap.set(this._id(doc), { expAt: Date.now() + this._exp, doc, group });
          } else {
            dataMap.delete(id);
          }
          this._data.next(dataMap);
        }),
        switchMap(() => this._data),
        gate(this.loading$, true),
        map(data => data.get(id)?.doc ?? null),
        shareReplay(1)
      );

    return this._data.pipe(
      gate(this.loading$, true),
      map(data => data.get(id)?.doc ?? null),
      shareReplay(1)
    );
  }
}