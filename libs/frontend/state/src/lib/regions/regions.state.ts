import { Injectable } from '@angular/core';
import { EntityTypes, Region } from '@pestras/shared/data-model';
import { tap, filter } from 'rxjs';
import { RegionsApi } from './regions.api';
import { StatorChannel, StatorCollectionState } from '@pestras/frontend/util/stator';
import { RegionsService } from './regions.service';
import { SessionEnd, SessionStart } from '../session/session.events';
import { SSEActivity } from '../sse/sse.events';

@Injectable({ providedIn: 'root' })
export class RegionsState extends StatorCollectionState<Region> {

  constructor(
    private channel: StatorChannel,
    private service: RegionsService
  ) {
    super('regions', 'serial', ['1h'], true);

    this.initListeners();
  }

  private initListeners() {
    // when session starts fetch all regions
    this.channel.select(SessionStart)
      .subscribe(() => {
        this._init();
        this._setLoading(false);
      });

    // when session ends clear state
    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());

    // sse events
    this.channel.select(SSEActivity)
      .pipe(filter(act => act.entity === EntityTypes.RECORD))
      .subscribe(act => {
        // new region
        if (act.method === 'create')
          this.service.getBySerial({ serial: act.serial })
            .subscribe(r => !!r && this._insert(r));

        // region updates
        else if (act.method === 'update')
          this._update(act.serial, { ...act.payload, last_modified: new Date() });
      });
  }

  protected override _load() {
    return this.service.getAll();
  }

  protected getBySerial(params: RegionsApi.GetBySerial.Params) {
    return this.service.getBySerial(params)
      .pipe(tap(res => res && this._upsert(res)));
  }

  create(data: RegionsApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(res => this._insert(res)));
  }

  update(params: RegionsApi.Update.Params, data: RegionsApi.Update.Body) {
    return this.service.update(params, data)
      .pipe(tap(res => this._update(params.serial, { ...data, last_modified: new Date(res) })));
  }

  updateCoords(params: RegionsApi.UpdateCoords.Params, data: RegionsApi.UpdateCoords.Body) {
    return this.service.updateCoords(params, data)
      .pipe(tap(res => this._update(params.serial, { coords: data, last_modified: new Date(res) })));
  }
}