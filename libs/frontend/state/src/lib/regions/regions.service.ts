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

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.GetAll.REQ_FULL_PATH);

    return this.http[RegionsApi.GetAll.REQ_METHOD]<RegionsApi.GetAll.Response>(path);
  }

  getBySerial(params: RegionsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.GetBySerial.REQ_FULL_PATH, params);

    return this.http[RegionsApi.GetBySerial.REQ_METHOD]<RegionsApi.GetBySerial.Response>(path);
  }

  create(data: RegionsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.Create.REQ_FULL_PATH);

    return this.http[RegionsApi.Create.REQ_METHOD]<RegionsApi.Create.Response>(path, data);
  }

  update(params: RegionsApi.Update.Params, data: RegionsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.Update.REQ_FULL_PATH, params);

    return this.http[RegionsApi.Update.REQ_METHOD]<RegionsApi.Update.Response>(path, data);
  }

  updateCoords(params: RegionsApi.UpdateCoords.Params, data: RegionsApi.UpdateCoords.Body) {
    const path = injectURLPayload(this.envServ.env.api + RegionsApi.UpdateCoords.REQ_FULL_PATH, params);

    return this.http[RegionsApi.UpdateCoords.REQ_METHOD]<RegionsApi.UpdateCoords.Response>(path, data);
  }
}