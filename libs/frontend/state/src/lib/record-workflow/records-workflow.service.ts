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

  getRecordActiveWF(params: RecordsWorkflowApi.GetRecordActiveWFState.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.GetRecordActiveWFState.REQ_PATH, params);

    return this.http.get<RecordsWorkflowApi.GetRecordActiveWFState.Response>(path);
  }

  publish(params: RecordsWorkflowApi.Publish.Params, body: RecordsWorkflowApi.Publish.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.Publish.REQ_PATH, params);

    return this.http.post<RecordsWorkflowApi.Publish.Response>(path, body);
  }

  approve(params: RecordsWorkflowApi.Approve.Params, body: RecordsWorkflowApi.Approve.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.Approve.REQ_PATH, params);

    return this.http.put<RecordsWorkflowApi.Approve.Response>(path, body);
  }

  reject(params: RecordsWorkflowApi.Reject.Params, body: RecordsWorkflowApi.Approve.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsWorkflowApi.Reject.REQ_PATH, params);

    return this.http.put<RecordsWorkflowApi.Reject.Response>(path, body);
  }
}