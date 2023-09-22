import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecordsWorkflowApi } from './records-workflow.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable()
export class RecordsWorkflowService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  getByRecord(params: RecordsWorkflowApi.GetByRecord.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.GetByRecord.REQ_PATH, params);

    return this.http.get<RecordsWorkflowApi.GetByRecord.Response>(path);
  }

  getRecordState(params: RecordsWorkflowApi.GetRecordState.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.GetRecordState.REQ_PATH, params);

    return this.http.get<RecordsWorkflowApi.GetRecordState.Response>(path);
  }

  publish(params: RecordsWorkflowApi.Publish.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.Publish.REQ_PATH, params);

    return this.http.post<RecordsWorkflowApi.Publish.Response>(path, null);
  }

  approve(params: RecordsWorkflowApi.Approve.Params, body: RecordsWorkflowApi.Approve.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.Approve.REQ_PATH, params);

    return this.http.put<RecordsWorkflowApi.Approve.Response>(path, body);
  }

  reject(params: RecordsWorkflowApi.Reject.Params, body: RecordsWorkflowApi.Approve.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.Reject.REQ_PATH, params);

    return this.http.put<RecordsWorkflowApi.Reject.Response>(path, body);
  }

  cancel(params: RecordsWorkflowApi.Cancel.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.Cancel.REQ_PATH, params);

    return this.http.delete<RecordsWorkflowApi.Cancel.Response>(path);
  }
}