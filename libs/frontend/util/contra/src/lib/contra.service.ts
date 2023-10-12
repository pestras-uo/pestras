/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, distinctUntilChanged, of, map, shareReplay, Subject, tap, catchError, forkJoin, startWith } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { strUtil } from '@pestras/shared/util';
import { CONTRA_CONFIG, ContraResourceConfig, ContraConfig } from './config';



type ContentCache = {
  [lang: string]: {
    [resName: string]: {
      date: Date | null;
      content: Record<string, any> | null;
    }
  }
}

@Injectable()
export class ContraService {

  // Private Members
  // -------------------------------------------------------------------------------------------------
  private readonly _storageKey = 'ji940gnb3pgj2i249g';
  private readonly _langSub = new BehaviorSubject<string>('');
  private readonly _loading = new BehaviorSubject<boolean>(true);
  private readonly _change = new Subject<string[]>();

  private _cache: ContentCache = {};


  // Public Members
  // -------------------------------------------------------------------------------------------------
  public loading$ = this._loading.pipe(distinctUntilChanged());

  public readonly lang$ = this._langSub.pipe(
    filter(key => !!key),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(
    @Inject(CONTRA_CONFIG) private readonly _config: ContraConfig,
    private readonly http: HttpClient
  ) {
    this._init();
  }

  // Private Methods
  // -------------------------------------------------------------------------------------------------
  private _init() {
    if (!this._config)
      throw new Error('Pestras contra config was not provided, please use module forRoot() to pass the required config');

    for (const lang of this._config.languages) {
      this._cache[lang.key] = {};

      for (const res of this._config.resources)
        this._cache[lang.key][res.name] = {
          date: null,
          content: null
        }
    }

    const activeLang = localStorage.getItem(this._storageKey) || this._config.languages[0].key;
    this.changeLanguage(activeLang);
  }

  private _updateHTMLDocument(langKey: string) {
    const langMeta = this._config.languages.find(lang => lang.key === langKey);

    if (!langMeta)
      return;

    document.documentElement.lang = langMeta.key;
    document.documentElement.dir = langMeta.dir;
  }

  private _isResExpired(langKey: string, res: ContraResourceConfig) {
    const date = this._cache[langKey][res.name].date;

    if (!date)
      return true;

    if (res.expireMS < (1000 * 60))
      return false;

    return Date.now() - date.getTime() > res.expireMS;
  }

  private _getResource(langKey: string, res: ContraResourceConfig) {
    if (!this._isResExpired(langKey, res))
      return of(null);

    return this.http.get(`${res.path}/${langKey}.json?${Math.random}`)
      .pipe(
        catchError(e => {
          console.error('error fetching', res.name, 'resource content!');
          console.error(e);
          return of(null)
        }),
        tap(data => this._cache[langKey][res.name].content = data),
        map(() => res.name)
      );
  }

  private _getResources(langKey: string, resources: ContraResourceConfig[]) {
    return forkJoin(resources.map(res => this._getResource(langKey, res)))
      .pipe(
        tap(changedResources => this._change.next(changedResources.filter(c => !!c) as string[])),
        tap(() => this._loading.next(false)),
        tap(res => {
          console.groupCollapsed('resource loaded for language:', this.currLang?.name)
          console.log('resources', res.filter(Boolean));
          console.groupEnd()
        })
      );
  }

  private _checkExpiry() {
    setTimeout(() => {
      const expired = this._config.resources.filter(res => this._isResExpired(this.currLangKey, res));

      if (expired.length > 0) {
        this._getResources(this.currLangKey, expired)
          .subscribe(() => this._checkExpiry());
      }

    }, 60000);
  }

  // Public Methods
  // -------------------------------------------------------------------------------------------------
  get currLangKey() {
    return this._langSub.getValue();
  }

  get languages() {
    return this._config.languages.map(lang => Object.assign({}, lang));
  }

  get currLang() {
    return this.languages.find(l => l.key === this.currLangKey);
  }

  content(...resources: string[]) {
    const names = resources.length === 0
      ? [this._config.resources[0].name]
      : resources;

    const langKey = this.currLangKey;
    const output: Record<string, any> = {};

    for (const name of names)
      Object.assign(output, this._cache[langKey][name].content || {});

    return output;
  }

  public fill(key: string, data: Record<string, any> = {}, resources: string[] = []): string {
    const c = this.content(...resources);
    return strUtil.compile(c[key], c, data ?? {});
  }

  select(...resources: string[]) {
    const names = resources.length === 0
      ? [this._config.resources[0].name]
      : resources;

    return this._change
      .pipe(
        startWith(names),
        filter(resNames => resNames.some(n => names.includes(n))),
        map(() => this.content(...names)),
        shareReplay(1)
      );
  }

  changeLanguage(langKey: string) {
    if (this.currLangKey === langKey)
      return;

    const newLang = this.languages.find(lang => lang.key === langKey) || this._config.languages[0];

    if (!newLang)
      throw new Error(`language not found with key: ${langKey}`);

    localStorage.setItem(this._storageKey, newLang.key);

    this._loading.next(true);
    this._langSub.next(langKey);
    this._getResources(langKey, this._config.resources)
      .subscribe(() => this._updateHTMLDocument(langKey));
  }
}