import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataVizApi } from './data-viz.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable({ providedIn: 'root' })
export class DatavizService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) {}

  getBySerial(params: DataVizApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + DataVizApi.GetBySerial.REQ_PATH, params);

    return this.http.get<DataVizApi.GetBySerial.Reponse>(path);
  }

  create(body: DataVizApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + DataVizApi.Create.REQ_PATH);

    return this.http.post<DataVizApi.Create.Reponse>(path, body);
  }

  update(params: DataVizApi.Update.Params, body: DataVizApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + DataVizApi.Update.REQ_PATH, params);

    return this.http.put<DataVizApi.Update.Reponse>(path, body);
  }
}