import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UsersGroupsApi } from './users-groups.api';
import { injectURLPayload } from '@pestras/util';
import { STATE_CONFIG, StateConfig } from '../config';

@Injectable({ providedIn: 'root' })
export class UsersGroupsService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) {}

  getAll() {
    const path = injectURLPayload(this.config.api + UsersGroupsApi.GetAll.path);

    return this.http.get<UsersGroupsApi.GetAll.Response>(path);
  }

  getBySerial(params: UsersGroupsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + UsersGroupsApi.GetBySerial.path, params);

    return this.http.get<UsersGroupsApi.GetBySerial.Response>(path);
  }

  create(body: UsersGroupsApi.Create.Body) {
    const path = injectURLPayload(this.config.api + UsersGroupsApi.Create.path);
    
    return this.http.post<UsersGroupsApi.Create.Response>(path, body);
  }

  update(params: UsersGroupsApi.Update.Params, body: UsersGroupsApi.Update.Body) {
    const path = injectURLPayload(this.config.api + UsersGroupsApi.Update.path, params);

    return this.http.put<UsersGroupsApi.Update.Response>(path, body);
  }

  delete(params: UsersGroupsApi.Delete.Params) {
    const path = injectURLPayload(this.config.api + UsersGroupsApi.Delete.path, params);

    return this.http.delete<UsersGroupsApi.Delete.Response>(path);
  }
}