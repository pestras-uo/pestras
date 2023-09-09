import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { injectURLPayload } from '@pestras/shared/util';
import { TopicsApi } from './topics.api';
import { EnvService } from '@pestras/frontend/env';

@Injectable()
export class TopicsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) {}

  getByParent(params: TopicsApi.GetByParent.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.GetByParent.REQ_PATH, params);

    return this.http.get<TopicsApi.GetByParent.Response>(path);
  }

  getBySerial(params: TopicsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<TopicsApi.GetBySerial.Response>(path);
  }

  create(body: TopicsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.Create.REQ_PATH);

    return this.http.post<TopicsApi.Create.Response>(path, body);
  }

  update(params: TopicsApi.Update.Params, body: TopicsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.Update.REQ_PATH, params);

    return this.http.put<TopicsApi.Update.Response>(path, body);
  }

  // access
  // ---------------------------------------------------------------------------------------------------
  // Orgunits
  addAccessOrgunit(params: TopicsApi.AddAccessOrgunit.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.AddAccessOrgunit.path, params);

    return this.http.post<TopicsApi.AddAccessOrgunit.Response>(path, null);
  }

  removeAccessOrgunit(params: TopicsApi.RemoveAccessOrgunit.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.RemoveAccessOrgunit.path, params);

    return this.http.delete<TopicsApi.RemoveAccessOrgunit.Response>(path);
  }

  // Users
  addAccessUser(params: TopicsApi.AddAccessUser.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.AddAccessUser.path, params);

    return this.http.post<TopicsApi.AddAccessUser.Response>(path, null);
  }
  removeAccessUser(params: TopicsApi.RemoveAccessUser.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.RemoveAccessUser.path, params);

    return this.http.delete<TopicsApi.RemoveAccessUser.Response>(path);
  }

  // Groups
  addAccessGroup(params: TopicsApi.AddAccessGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.AddAccessGroup.path, params);

    return this.http.post<TopicsApi.AddAccessGroup.Response>(path, null);
  }
  removeAccessGroup(params: TopicsApi.RemoveAccessGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + TopicsApi.RemoveAccessGroup.path, params);

    return this.http.delete<TopicsApi.RemoveAccessGroup.Response>(path);
  }
}