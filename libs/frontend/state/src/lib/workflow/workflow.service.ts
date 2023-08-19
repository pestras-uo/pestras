import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkflowApi } from './workflow.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable({ providedIn: 'root' })
export class WorkflowService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  getByEntity(params: WorkflowApi.GetByRecord.Params) {
    const path = injectURLPayload(this.envServ.env.api + WorkflowApi.GetByRecord.REQ_PATH, params);

    return this.http.get<WorkflowApi.GetByRecord.Response>(path);
  }

  publish(params: WorkflowApi.Publish.Params) {
    const path = injectURLPayload(this.envServ.env.api + WorkflowApi.Publish.REQ_PATH, params);

    return this.http.post<WorkflowApi.Publish.Response>(path, null);
  }

  approve(params: WorkflowApi.Approve.Params) {
    const path = injectURLPayload(this.envServ.env.api + WorkflowApi.Approve.REQ_PATH, params);

    return this.http.post<WorkflowApi.Approve.Response>(path, null);
  }

  cancel(params: WorkflowApi.Cancel.Params) {
    const path = injectURLPayload(this.envServ.env.api + WorkflowApi.Cancel.REQ_PATH, params);

    return this.http.post<WorkflowApi.Cancel.Response>(path, null);
  }
}