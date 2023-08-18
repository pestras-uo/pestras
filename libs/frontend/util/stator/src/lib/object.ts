/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, distinctUntilChanged, filter, map, shareReplay } from "rxjs";
import { objUtil } from "@pestras/shared/util";
import { DeepPartial, UpdateMode } from "./types";
import { gate } from './util';


export abstract class StatorObjectState<T extends Record<string, any> = any> {

  private readonly _data!: BehaviorSubject<T | null>;
  private _prevState: T | null = null;
  private readonly _loading!: BehaviorSubject<boolean>;

  public readonly data$!: Observable<T | null>;
  public readonly loading$!: Observable<boolean>;

  constructor(public readonly name: string, private _initState: T | null = null, isLoading = false) {

    this._loading = new BehaviorSubject<boolean>(isLoading);
    this.loading$ = this._loading.pipe(distinctUntilChanged());

    this._data = new BehaviorSubject<T | null>(objUtil.freezeObj(_initState));
    this.data$ = this._data.pipe(
      gate(this.loading$, true),
      filter(data => !!data),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  // loading
  // -------------------------------------------------------------------------------------
  protected _setLoading(state = true) {
    this._loading.next(state);
  }




  // getters
  // -------------------------------------------------------------------------------------
  get(): T | null
  get<U>(path?: string): U
  get<U>(path?: string): T | U | null {
    const data = this._data.getValue();

    return !data
      ? null
      : path
        ? objUtil.getValueFromPath(path, data)
        : data;
  }




  // selectors
  // -------------------------------------------------------------------------------------
  select(): Observable<T | null>
  select<U>(path?: string): Observable<U | null>
  select<U>(path?: string): Observable<T | U | null> {
    return this.data$.pipe(
      map(data => path ? objUtil.getValueFromPath(path, data): data),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }




  // setters
  // -------------------------------------------------------------------------------------
  protected _set(data: (state: T | null) => T | null): void;
  protected _set(data: T | DeepPartial<T> | null, mode?: UpdateMode): void;
  protected _set<U extends keyof T>(key: U, value: T[U] | ((state: T) => T[U]), mode?: UpdateMode, createPath?: boolean): void
  protected _set<U extends keyof T>(data: T | DeepPartial<T> | string | null | ((state: T | null) => T | null), value?: any | UpdateMode | ((state: T) => T[U]), mode: UpdateMode = 'merge', createPath = false): void {
    const curr = objUtil.cloneObject(this._data.getValue());
    let newState: T | null = null;

    // when data is null, call clear instead
    if (data === null)
      return this._clear();

    if (typeof data === 'function') {
      const ret = data(curr);

      if (ret === null)
        return this._clear();

      newState = objUtil.cloneObject(ret);
    }
    // when set is on path
    else if (typeof data === 'string') {
      // when no value already exists cancel operation
      if (!curr)
        return;

      const ret = typeof value === 'function' ? value(curr) : value;

      newState = mode === 'replace'
        ? objUtil.setValueOnPath(data, ret, curr, createPath)
        : mode === 'merge'
          ? objUtil.mergeValueOnPath(data, ret, curr, createPath)
          : objUtil.deepMergeValueOnPath(data, ret, curr, createPath)

    } else {
      newState = mode === 'replace'
        ? objUtil.cloneObject(data)
        : mode === 'merge'
          ? objUtil.merge(curr, data)
          : objUtil.deepMerge(curr, data);
    }

    newState = Object.freeze(newState);
    this._data.next(newState);
    this._prevState = curr;
  }

  protected _revert() {
    this._set(this._prevState as any);
  }




  // clear
  // -------------------------------------------------------------------------------------
  protected _clear() {
    this._prevState = this._data.getValue();
    this._data.next(this._initState);
  }
}