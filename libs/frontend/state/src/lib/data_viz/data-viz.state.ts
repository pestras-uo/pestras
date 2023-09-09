/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { DataVizApi } from './data-viz.api';
import { StatorChannel, StatorQueryState } from '@pestras/frontend/util/stator';
import { BaseDataViz } from '@pestras/shared/data-model';
import { DatavizService } from './data-viz.service';
import { tap } from 'rxjs';
import { SessionEnd } from '../session/session.events';

@Injectable({ providedIn: 'root' })
export class DataVizState extends StatorQueryState<BaseDataViz<any>> {

  constructor(
    private service: DatavizService,
    private channel: StatorChannel
  ) {
    super('dataViz', 'serial', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetchDoc(id: string) {
    return this.service.getBySerial({ serial: id });
  }

  create(data: DataVizApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(res => this._insert(res)));
  }

  update(serial: string, data: DataVizApi.Update.Body) {
    return this.service.update({ serial }, data)
      .pipe(tap(res => this._update(serial, { ...data, last_modified: new Date(res) })));
  }
}