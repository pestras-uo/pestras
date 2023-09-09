import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlueprintsApi } from './blueprints.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable()
export class BlueprintsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + BlueprintsApi.GetAll.REQ_PATH);

    return this.http.get<BlueprintsApi.GetAll.Response>(path);
  }

  getBySerial(params: BlueprintsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + BlueprintsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<BlueprintsApi.GetBySerial.Response>(path);
  }

  create(body: BlueprintsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + BlueprintsApi.Create.REQ_PATH);

    return this.http.post<BlueprintsApi.Create.Response>(path, body);
  }

  update(params: BlueprintsApi.Update.Params, body: BlueprintsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + BlueprintsApi.Update.REQ_PATH, params);

    return this.http.put<BlueprintsApi.Update.Response>(path, body);
  }

  addCollaborator(params: BlueprintsApi.AddCollaborator.Params) {
    const path = injectURLPayload(this.envServ.env.api + BlueprintsApi.AddCollaborator.REQ_PATH, params);

    return this.http.post<BlueprintsApi.AddCollaborator.Response>(path, null);
  }

  removeCollaborator(params: BlueprintsApi.RemoveCollaborator.Params) {
    const path = injectURLPayload(this.envServ.env.api + BlueprintsApi.RemoveCollaborator.REQ_PATH, params);

    return this.http.delete<BlueprintsApi.RemoveCollaborator.Response>(path);
  }
}