import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BlueprintsApi } from './blueprints.api';
import { injectURLPayload } from '@pestras/util';
import { STATE_CONFIG, StateConfig } from '../config';

@Injectable({ providedIn: 'root' })
export class BlueprintsService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) { }

  getAll() {
    const path = injectURLPayload(this.config.api + BlueprintsApi.GetAll.REQ_PATH);

    return this.http.get<BlueprintsApi.GetAll.Response>(path);
  }

  getBySerial(params: BlueprintsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + BlueprintsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<BlueprintsApi.GetBySerial.Response>(path);
  }

  create(body: BlueprintsApi.Create.Body) {
    const path = injectURLPayload(this.config.api + BlueprintsApi.Create.REQ_PATH);

    return this.http.post<BlueprintsApi.Create.Response>(path, body);
  }

  update(params: BlueprintsApi.Update.Params, body: BlueprintsApi.Update.Body) {
    const path = injectURLPayload(this.config.api + BlueprintsApi.Update.REQ_PATH, params);

    return this.http.put<BlueprintsApi.Update.Response>(path, body);
  }

  addCollaborator(params: BlueprintsApi.AddCollaborator.Params) {
    const path = injectURLPayload(this.config.api + BlueprintsApi.AddCollaborator.REQ_PATH, params);

    return this.http.post<BlueprintsApi.AddCollaborator.Response>(path, null);
  }

  removeCollaborator(params: BlueprintsApi.RemoveCollaborator.Params) {
    const path = injectURLPayload(this.config.api + BlueprintsApi.RemoveCollaborator.REQ_PATH, params);

    return this.http.delete<BlueprintsApi.RemoveCollaborator.Response>(path);
  }
}