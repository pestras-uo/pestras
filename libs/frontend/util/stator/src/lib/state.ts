/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, distinctUntilChanged, switchMap, tap, map, Observable, of } from "rxjs";
import { TimeDuration, objUtil, parseDuration } from "@pestras/shared/util";

export interface StatorStateConfig<T = any> {
  exp: number;
  init: T;
  date: number;
  subject: BehaviorSubject<T>;
  meta?: any;
}

export abstract class StatorState<T = any> {
  private readonly _data = new Map<string, StatorStateConfig<T>>();

  constructor(
    public readonly name: string,
    private init: T,
    private exp: TimeDuration | null
  ) { }

  protected _initState(key: string, exp?: TimeDuration | null, init?: T) {
    const curr = this._data.get(key);

    exp = exp === undefined ? this.exp : exp;
    init = init === undefined ? this.init : init;

    if (curr) {
      curr.date = 0;
      curr.exp = exp ? parseDuration(exp as TimeDuration) : 0;
      curr.init = init;

    } else
      this._data.set(key, {
        exp: exp
          ? parseDuration(exp as TimeDuration)
          : Infinity,
        init: init,
        subject: new BehaviorSubject<T>(init),
        date: 0
      });

    return this._data.get(key);
  }



  // abstract
  // ---------------------------------------------------------------------------------
  protected abstract _fetch(key: string, ...args: any[]): Observable<T>;



  // protected
  // ---------------------------------------------------------------------------------
  protected _set(key: string, data: T | null): void
  protected _set(key: string, reducer: (state: T) => T | null): void
  protected _set(key: string, data: any | ((state: T | null) => any)) {
    const opt = this._data.get(key);

    if (!opt) {
      console.warn('undefined state key:', key);
      return;
    }

    const input = typeof data === 'function'
      ? data(opt.subject.getValue())
      : data

    opt.subject.next(objUtil.cloneObject(input));
    opt.date = Date.now();
  }

  protected _setMeta(key: string, meta: any) {
    const opt = this._data.get(key);

    if (!opt) {
      console.warn('undefined state key:', key);
      return;
    }

    opt.meta = meta;
  }

  protected _reset(key: string) {
    const opt = this._data.get(key);

    if (!opt) {
      console.warn('undefined state key:', key);
      return;
    }

    opt.subject.next(opt.init);
    opt.date = 0;
  }

  protected _clear() {
    for (const opt of this._data.values()) {
      opt.subject.next(opt.init);
      opt.date = 0;
    }
  }

  // getters
  // -------------------------------------------------------------------------------
  get(key: string): T | null {
    const opt = this._data.get(key);

    if (!opt) {
      console.warn('undefined state key:', key);
      return null;
    }

    return opt.subject.getValue() as T;
  }

  meta(key: string) {
    return this._data.get(key)?.meta ?? null
  }

  has(key: string) {
    return this._data.has(key);
  }

  select(key: string, ...args: any[]): Observable<T | null> {
    const opt = this._data.get(key) ?? this._initState(key);

    if (opt && (opt.date + opt.exp) < Date.now()) {
      return this._fetch(key, ...args)
        .pipe(
          tap(data => {
            opt.date = Date.now();
            opt.subject.next(data);
          }),
          switchMap(() => opt.subject),
          map(data => objUtil.cloneObject(data)),
          distinctUntilChanged()
        )
    }

    return opt ? opt.subject
      .pipe(
        map(data => objUtil.cloneObject(data)),
        distinctUntilChanged()
      )
      : of(null);
  }
}