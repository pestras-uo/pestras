import { Injectable } from '@angular/core';
import { EntityTypes, Region, RegionsApi } from '@pestras/shared/data-model';
import { tap, filter } from 'rxjs';
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
      .pipe(tap(() => this._init()))
      .subscribe(() => this._setLoading(false));

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

  // create, update
  // -------------------------------------------------------------------------------------------------------
  create(data: RegionsApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(res => this._insert(res)));
  }

  update(params: RegionsApi.Update.Params, data: RegionsApi.Update.Body) {
    return this.service.update(params, data)
      .pipe(tap(res => this._update(params.serial, { ...data, last_modified: new Date(res) })));
  }

  // boundry coords
  // -------------------------------------------------------------------------------------------------------
  updateCoords(params: RegionsApi.UpdateCoords.Params, data: RegionsApi.UpdateCoords.Body) {
    return this.service.updateCoords(params, data)
      .pipe(tap(res => this._update(params.serial, { coords: data, last_modified: new Date(res) })));
  }

  // gis map
  // -------------------------------------------------------------------------------------------------------
  addGisMap(serial: string, data: RegionsApi.AddGisMap.Body) {
    return this.service.addGisMap({ serial }, data)
      .pipe(tap(map => this._update(serial, r => ({ ...r, gis: r.gis.concat(map) }))))
  }

  updateGisMap(serial: string, mapSerial: string, data: RegionsApi.UpdateGisMap.Body) {
    return this.service.updateGisMap({ serial, map: mapSerial }, data)
      .pipe(tap(() => this._update(serial, r => ({
        ...r,
        gis: r.gis.map(m => m.serial === mapSerial ? { ...m, ...data } : m)
      }))));
  }

  updateGisMapApiKey(serial: string, mapSerial: string, key: string | null) {
    return this.service.updateGisMapApiKey({ serial, map: mapSerial }, { apiKey: key })
      .pipe(tap(() => this._update(serial, r => ({
        ...r,
        gis: r.gis.map(m => m.serial === mapSerial ? { ...m, apiKey: key } : m)
      }))));
  }

  removeGisMap(serial: string, mapSerial: string) {
    return this.service.removeGisMap({ serial, map: mapSerial })
      .pipe(tap(() => this._update(serial, r => ({
        ...r,
        gis: r.gis.filter(m => m.serial !== mapSerial)
      }))));
  }

  // gis map layer
  // -------------------------------------------------------------------------------------------------------
  addGisMapLayer(serial: string, mapSerial: string, data: RegionsApi.AddGisMapLayer.Body) {
    return this.service.addGisMapLayer({ serial, map: mapSerial }, data)
      .pipe(tap(layerSerial => this._update(serial, r => ({
        ...r,
        gis: r.gis.map(m => m.serial === mapSerial ? { ...m, layers: m.layers.concat({ ...data, serial: layerSerial }) } : m)
      }))));
  }

  updateGisMapLayer(serial: string, mapSerial: string, layerSerial: string, data: RegionsApi.UpdateGisMapLayer.Body) {
    return this.service.updateGisMapLayer({ serial, map: mapSerial, layer: layerSerial }, data)
      .pipe(tap(() => this._update(serial, r => ({
        ...r,
        gis: r.gis.map(m => m.serial === mapSerial
          ? {
            ...m, layers: m.layers.map(l => l.serial === layerSerial ? { ...l, ...data } : l)
          }
          : m
        )
      }
      ))));
  }

  removeGisMapLayer(serial: string, mapSerial: string, layer: string) {
    return this.service.removeGisMapLayer({ serial, map: mapSerial, layer })
      .pipe(tap(() => this._update(serial, r => ({
        ...r,
        gis: r.gis.map(m => m.serial === mapSerial ? { ...m, layers: m.layers.filter(l => l.serial !== layer) } : m)
      }))));
  }
}