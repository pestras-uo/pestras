import { Category, EntityTypes } from '@pestras/shared/data-model';
import { ApiQueryResults, StatorChannel, StatorQueryState } from '@pestras/frontend/util/stator';
import { CategoriesService } from './categories.service';
import { SessionEnd } from '../session/session.events';
import { CategoriesApi } from './categories.api';
import { tap, map, filter, Observable } from 'rxjs';
import { SSEActivity } from '../sse/sse.events';
import { Serial } from '@pestras/shared/util';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesState extends StatorQueryState<Category> {

  constructor(
    private readonly channel: StatorChannel,
    private readonly service: CategoriesService
  ) {
    super('categories', 'serial', ['1h'], true);

    this.initListeners();
  }

  private initListeners() {
    // when session ends clear state
    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());

    // sse events
    this.channel.select(SSEActivity)
      .pipe(filter(act => act.entity === EntityTypes.CATEGORY))
      .subscribe(act => {
        // new category
        if (act.method === 'create')
          this.service.getBySerial({ serial: act.serial })
            .subscribe(c => !!c && this._insert(c));

        // category deleted
        else if (act.method === 'delete')
          this._delete(act.serial);

        else if (act.method === 'update')
          this._update(act.serial, { last_modified: act.create_date, ...act.payload });
      });
  }

  protected override _fetchDoc(serial: string): Observable<Category | null> {
    return this.service.getBySerial({ serial });
  }

  protected override _fetchQuery(blueprint: string): Observable<ApiQueryResults<Category>> {
    return this.service.getByBlueprint({ blueprint })
      .pipe(map(res => ({ count: res.length, results: res })));
  }

  protected override _onChange(doc: Category): void {
    this._updateInQuery(doc.blueprint, doc);
  }

  protected override _onRemove(doc: Category): void {
    this._removeFromQuery(doc.blueprint, doc.serial);
  }

  // selectors
  // -------------------------------------------------------------------------------------------------
  selectParent(serial: string) {
    const ps = Serial.getParent(serial);

    return this.select(ps);
  }

  selectChildren(serial: string) {
    return this.selectMany(cat => Serial.isChild(serial, cat.serial));
  }

  selectTree(serial: string) {
    const tree = Serial.toTree(serial);
    return this.selectMany(cat => tree.includes(cat.serial))
      .pipe(map(list => list.sort((a, b) => Serial.countLevels(a.serial) - Serial.countLevels(b.serial))));
  }

  selectByBlueprint(bp: string) {
    return this.query(bp, null)
      .pipe(map(res => res.results));
  }

  // change
  // -------------------------------------------------------------------------------------------------
  create(data: CategoriesApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(res => this._insert(res)));
  }

  update(params: CategoriesApi.Update.Params, data: CategoriesApi.Update.Body) {
    return this.service.update(params, data)
      .pipe(tap(res => this._update(params.serial, {
        title: data.title,
        ordinal: data.ordinal,
        value: data.value,
        last_modified: new Date(res)
      })));
  }

  removeBranch(params: CategoriesApi.Delete.Params) {
    return this.service.removeBranch(params)
      .pipe(tap(() => this._delete(params.serial)));
  }
}