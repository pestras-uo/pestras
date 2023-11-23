import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';
import { RegionsApi } from '@pestras/shared/data-model';

@Injectable()
export class RegionsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  // read
  // -------------------------------------------------------------------------------------------------------
  getAll() {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.GetAll.REQ_FULL_PATH);

    return this.http[RegionsApi.GetAll.REQ_METHOD]<RegionsApi.GetAll.Response>(path);
  }

  getBySerial(params: RegionsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.GetBySerial.REQ_FULL_PATH, params);

    return this.http[RegionsApi.GetBySerial.REQ_METHOD]<RegionsApi.GetBySerial.Response>(path);
  }

  // create, update
  // -------------------------------------------------------------------------------------------------------
  create(data: RegionsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.Create.REQ_FULL_PATH);

    return this.http[RegionsApi.Create.REQ_METHOD]<RegionsApi.Create.Response>(path, data);
  }

  update(params: RegionsApi.Update.Params, data: RegionsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.Update.REQ_FULL_PATH, params);

    return this.http[RegionsApi.Update.REQ_METHOD]<RegionsApi.Update.Response>(path, data);
  }

  // boundry coords
  // -------------------------------------------------------------------------------------------------------
  updateCoords(params: RegionsApi.UpdateCoords.Params, data: RegionsApi.UpdateCoords.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.UpdateCoords.REQ_FULL_PATH, params);

    return this.http[RegionsApi.UpdateCoords.REQ_METHOD]<RegionsApi.UpdateCoords.Response>(path, data);
  }

  // gis map
  // -------------------------------------------------------------------------------------------------------
  addGisMap(params: RegionsApi.AddGisMap.Params, body: RegionsApi.AddGisMap.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.AddGisMap.REQ_FULL_PATH, params);

    return this.http[RegionsApi.AddGisMap.REQ_METHOD]<RegionsApi.AddGisMap.Response>(path, body);
  }

  updateGisMap(params: RegionsApi.UpdateGisMap.Params, body: RegionsApi.UpdateGisMap.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.UpdateGisMap.REQ_FULL_PATH, params);

    return this.http[RegionsApi.UpdateGisMap.REQ_METHOD]<RegionsApi.UpdateGisMap.Response>(path, body);
  }

  updateGisMapApiKey(params: RegionsApi.UpdateGisMapApiKey.Params, body: RegionsApi.UpdateGisMapApiKey.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.UpdateGisMapApiKey.REQ_FULL_PATH, params);

    return this.http[RegionsApi.UpdateGisMapApiKey.REQ_METHOD]<RegionsApi.UpdateGisMapApiKey.Response>(path, body);
  }

  removeGisMap(params: RegionsApi.RemoveGisMap.Params) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.RemoveGisMap.REQ_FULL_PATH, params);

    return this.http[RegionsApi.RemoveGisMap.REQ_METHOD]<RegionsApi.RemoveGisMap.Response>(path);
  }

  // gis map layer
  // -------------------------------------------------------------------------------------------------------
  addGisMapLayer(params: RegionsApi.AddGisMapLayer.Params, body: RegionsApi.AddGisMapLayer.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.AddGisMapLayer.REQ_FULL_PATH, params);

    return this.http[RegionsApi.AddGisMapLayer.REQ_METHOD]<RegionsApi.AddGisMapLayer.Response>(path, body);
  }

  updateGisMapLayer(params: RegionsApi.UpdateGisMapLayer.Params, body: RegionsApi.UpdateGisMapLayer.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.UpdateGisMapLayer.REQ_FULL_PATH, params);

    return this.http[RegionsApi.UpdateGisMapLayer.REQ_METHOD]<RegionsApi.UpdateGisMapLayer.Response>(path, body);
  }

  removeGisMapLayer(params: RegionsApi.RemoveGisMapLayer.Params) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.RemoveGisMapLayer.REQ_FULL_PATH, params);

    return this.http[RegionsApi.RemoveGisMapLayer.REQ_METHOD]<RegionsApi.RemoveGisMapLayer.Response>(path);
  }
}