import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { WorkflowApi } from './workflow.api';
import { injectURLPayload } from '@pestras/util';
import { STATE_CONFIG, StateConfig } from '../config';

@Injectable({ providedIn: 'root' })
export class WorkflowService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) { }

  getByEntity(params: WorkflowApi.GetByRecord.Params) {
    const path = injectURLPayload(this.config.api + WorkflowApi.GetByRecord.REQ_PATH, params);

    return this.http.get<WorkflowApi.GetByRecord.Response>(path);
  }

  publish(params: WorkflowApi.Publish.Params) {
    const path = injectURLPayload(this.config.api + WorkflowApi.Publish.REQ_PATH, params);

    return this.http.post<WorkflowApi.Publish.Response>(path, null);
  }

  approve(params: WorkflowApi.Approve.Params) {
    const path = injectURLPayload(this.config.api + WorkflowApi.Approve.REQ_PATH, params);

    return this.http.post<WorkflowApi.Approve.Response>(path, null);
  }

  cancel(params: WorkflowApi.Cancel.Params) {
    const path = injectURLPayload(this.config.api + WorkflowApi.Cancel.REQ_PATH, params);

    return this.http.post<WorkflowApi.Cancel.Response>(path, null);
  }
}