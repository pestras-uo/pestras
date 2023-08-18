import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AttachmentsApi } from './attachments.api';
import { injectURLPayload } from '@pestras/shared/util';
import { STATE_CONFIG, StateConfig } from '../config';

@Injectable({ providedIn: 'root' })
export class AttachmentService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) {}

  getBySerial(params: AttachmentsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + AttachmentsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<AttachmentsApi.GetBySerial.Response>(path);
  }

  getByEntity(params: AttachmentsApi.GetByEntity.Params) {
    const path = injectURLPayload(this.config.api + AttachmentsApi.GetByEntity.REQ_PATH, params);

    return this.http.get<AttachmentsApi.GetByEntity.Response>(path);
  }

  create(body: AttachmentsApi.Create.Body) {
    const path = injectURLPayload(this.config.api + AttachmentsApi.Create.REQ_PATH);
    const data = new FormData;

    data.set('name', body.name);
    data.set('entity', body.entity);
    data.set('attachment', body.attachment);

    return this.http.post<AttachmentsApi.Create.Response>(path, data);
  }

  updateName(params: AttachmentsApi.UpdateName.Params, body: AttachmentsApi.UpdateName.Body) {
    const path = injectURLPayload(this.config.api + AttachmentsApi.UpdateName.REQ_PATH, params);

    return this.http.put<AttachmentsApi.UpdateName.Response>(path, body);
  }

  removeBySerial(params: AttachmentsApi.RemoveBySerial.Params) {
    const path = injectURLPayload(this.config.api + AttachmentsApi.RemoveBySerial.REQ_PATH, params);

    return this.http.delete<AttachmentsApi.RemoveBySerial.Response>(path);
  }
}