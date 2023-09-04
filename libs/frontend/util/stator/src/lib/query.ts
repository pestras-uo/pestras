/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimeDuration, objUtil, parseDuration } from "@pestras/shared/util";
import { BehaviorSubject, Observable, map, shareReplay, switchMap, tap } from "rxjs";
import { UpdateMode } from "./types";

// types
// -------------------------------------------------------------------------------------
interface QueryCache<QUERY extends Record<string, unknown>> {
  query: QUERY;
  // last request call
  lastFetch: number;
  // response docs ids fetched
  keys: string[];
}

export interface StatorQueryStateConfig<
  DOC extends Record<string, unknown>,
  QUERY extends Record<string, unknown>
> {
  // expire duration
  exp: TimeDuration | number; // number in milliseconds
  cache: QueryCache<QUERY>[];
  // cached docs
  docs: BehaviorSubject<Map<string, DOC>>;
  // docs total count
  count: number;
}

export abstract class StatorQueryState<
  DOC extends Record<string, any>,
  QUERY extends Record<string, any>
> {
  private readonly _data = new BehaviorSubject(new Map<string, DOC>());
  private _qConfigs = new Map<string, StatorQueryStateConfig<DOC, QUERY>>();
  private readonly _exp!: number;
  private _expState = new Map<string, number>();

  constructor(
    public readonly name: string,
    public readonly key: keyof DOC,
    exp: TimeDuration | number = 0
  ) {
    this._exp = parseDuration(exp ?? 0);
  }

  // abstract
  // ----------------------------------------------------------------------------
  protected abstract _fetchDoc(key: string): Observable<DOC | null>;
  protected abstract _fetchQuery(key: string, query: QUERY): Observable<{ count: number; results: DOC[] }>;
  protected abstract _onChange(doc: DOC): void;


  // util
  // ----------------------------------------------------------------------------
  private _removeDocs(keys: string[], data = this._data.getValue()) {
    for (const key of keys) {
      data.delete(key);
      this._expState.delete(key);
    }
  }

  private _collect(keys: string[], map: Map<string, DOC>) {
    const docs: DOC[] = [];

    for (const key of keys)
      if (map.has(key))
        docs.push(map.get(key) as DOC);

    return docs;
  }

  private _getCache(selector: StatorQueryStateConfig<DOC, QUERY>, query: QUERY) {
    let cacheIndex = selector.cache.findIndex(c => objUtil.equals(query, c.query));

    if (cacheIndex === -1) {
      cacheIndex = selector.cache.length;
      selector.cache.push({ query, keys: [], lastFetch: 0 });
    }

    return selector.cache[cacheIndex];
  }


  // setters
  // ----------------------------------------------------------------------------
  protected _insert(doc: DOC) {
    const dataMap = this._data.getValue();

    if (dataMap.has(doc[this.key] as string))
      return this._update(doc[this.key] as string, doc);

    const newDoc = objUtil.freezeObj(objUtil.cloneObject(doc));

    dataMap.set(newDoc[this.key] as string, newDoc);
    this._expState.set(newDoc[this.key] as string, Date.now());

    this._onChange(newDoc);

    this._data.next(dataMap);
  }

  protected _update(key: string, update: Partial<DOC>, mode?: UpdateMode): void
  protected _update(key: string, compute: (doc: DOC) => DOC): void
  protected _update(key: string, update: Partial<DOC> | ((doc: DOC) => DOC), mode: UpdateMode = 'merge') {
    const dataMap = this._data.getValue();
    const curr = objUtil.cloneObject(dataMap.get(key as string));

    if (!curr)
      return;

    let newDoc: DOC;

    if (typeof update === 'function') {
      newDoc = { ...update(curr), [this.key]: curr[this.key] };
    } else {
      newDoc = mode === 'replace'
        ? { ...update }
        : mode === 'merge'
          ? objUtil.merge(curr, update)
          : objUtil.deepMerge(curr, update);
    }

    newDoc = objUtil.freezeObj(objUtil.cloneObject(newDoc));
    dataMap.set(curr[this.key] as string, newDoc);
    this._expState.set(curr[this.key] as string, Date.now());

    this._onChange(newDoc);

    this._data.next(dataMap);
  }

  protected _delete(key: string) {
    const dataMap = this._data.getValue();

    if (dataMap.has(key)) {
      dataMap.delete(key);
      this._expState.delete(key);
      this._data.next(dataMap);
    }
  }

  protected _clear() {
    this._data.next(new Map());
    this._expState = new Map();
    this._qConfigs = new Map();
  }



  // Query Config
  // ----------------------------------------------------------------------------
  protected _addQueryConfig(key: string, exp: TimeDuration | number) {
    const selector: StatorQueryStateConfig<DOC, QUERY> = {
      cache: [],
      exp: parseDuration(exp),
      docs: new BehaviorSubject(new Map()),
      count: 0
    }

    this._qConfigs.set(key, selector);
    return selector;
  }

  protected _clearQueryCache(key: string) {
    const conf = this._qConfigs.get(key);

    if (conf) {
      conf.cache = [];
      conf.count = 0;
      conf.exp = 0;
      conf.docs.next(new Map());
    }
  }

  protected _updateInQuery(key: string, doc: DOC) {
    const conf = this._qConfigs.get(key);

    if (conf) {
      const data = conf.docs.getValue();

      conf.count;
      data.set(doc[this.key] as string, doc);

      if (!data.has(doc[this.key] as string))
        conf.cache[0]?.keys.push(doc[this.key] as string);

      conf.docs.next(data);
    }
  }


  // getters
  // ----------------------------------------------------------------------------
  get(key: string): DOC | null
  get(filter: (doc: DOC) => boolean): DOC | null
  get(key: string | ((doc: DOC) => boolean)): DOC | null {
    if (typeof key === 'string')
      return this._data.getValue().get(key as string) ?? null;

    for (const doc of this._data.getValue().values())
      if (key(doc))
        return doc;

    return null;
  }


  // selectors
  // ----------------------------------------------------------------------------
  select(key: string) {
    const data = this._data.getValue();
    const doc = data.get(key);

    if (!doc || ((this._expState.get(key) ?? 0) + this._exp) < Date.now())
      return this._fetchDoc(key).pipe(
        tap(() => this._expState.set(key, Date.now())),
        tap(doc => {
          if (doc) {
            data.set(doc[this.key] as string, doc);
          } else {
            this._removeDocs([key], data);
          }
          this._data.next(data);
        }),
        switchMap(() => this._data),
        map(data => data.get(key) ?? null),
        shareReplay(1)
      );

    return this._data.pipe(
      map(data => data.get(key) ?? null),
      shareReplay(1)
    );
  }

  query(key: string, query: QUERY, exp?: TimeDuration | number): Observable<{ count: number; results: DOC[] }> {
    const selector = this._qConfigs.get(key) ?? this._addQueryConfig(key, exp ?? this._exp);
    const cached = this._getCache(selector, query);
    
    if ((cached.lastFetch + +selector.exp) < Date.now()) {
      return this._fetchQuery(key, query)
        .pipe(
          tap(res => {
            const data = selector.docs.getValue();

            if (!res) {
              if (cached.keys.length) {
                this._removeDocs(cached.keys, data);
                selector.docs.next(data);
              }

              cached.keys = []
              cached.lastFetch = Date.now();
              selector.count = 0;

            } else {

              const docs: DOC[] = res.results;

              if (cached.keys.length)
                for (const key of cached.keys)
                  data.delete(key);

              cached.keys = docs.map(d => d[this.key] as string);
              cached.lastFetch = Date.now();

              for (const doc of docs)
                data.set(doc[this.key] as string, doc);

              selector.count = res.count;
              selector.docs.next(data);
            }

          }),
          switchMap(() => selector.docs),
          map(docs => ({ count: selector.count, results: this._collect(cached.keys, docs) })),
          shareReplay(1)
        );
    }
    
    return selector.docs.pipe(
      map(docs => ({ count: selector.count, results: this._collect(cached.keys, docs) })),
      shareReplay(1)
    );
  }
}