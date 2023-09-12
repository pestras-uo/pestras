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
}