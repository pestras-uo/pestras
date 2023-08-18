import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RegionsApi } from './regions.api';
import { injectURLPayload } from '@pestras/shared/util';
import { STATE_CONFIG, StateConfig } from '../config';

@Injectable({ providedIn: 'root' })
export class RegionsService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) {}

  getAll() {
    const path = injectURLPayload(this.config.api + RegionsApi.GetAll.path);
    
    return this.http.get<RegionsApi.GetAll.Response>(path);
  }

  getBySerial(params: RegionsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + RegionsApi.GetBySerial.path, params);

    return this.http.get<RegionsApi.GetBySerial.Response>(path);
  }

  create(data: RegionsApi.Create.Body) {
    const path = injectURLPayload(this.config.api + RegionsApi.Create.path);

    return this.http.post<RegionsApi.Create.Response>(path, data);
  }

  update(params: RegionsApi.Update.Params, data: RegionsApi.Update.Body) {
    const path = injectURLPayload(this.config.api + RegionsApi.Update.path, params);

    return this.http.put<RegionsApi.Update.Response>(path, data);
  }

  updateCoords(params: RegionsApi.UpdateCoords.Params, data: RegionsApi.UpdateCoords.Body) {
    const path = injectURLPayload(this.config.api + RegionsApi.UpdateCoords.path, params);

    return this.http.put<RegionsApi.UpdateCoords.Response>(path, data);
  }
}