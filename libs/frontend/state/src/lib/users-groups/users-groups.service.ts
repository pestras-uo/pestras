import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersGroupsApi } from './users-groups.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable({ providedIn: 'root' })
export class UsersGroupsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) {}

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + UsersGroupsApi.GetAll.path);

    return this.http.get<UsersGroupsApi.GetAll.Response>(path);
  }

  getBySerial(params: UsersGroupsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + UsersGroupsApi.GetBySerial.path, params);

    return this.http.get<UsersGroupsApi.GetBySerial.Response>(path);
  }

  create(body: UsersGroupsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + UsersGroupsApi.Create.path);
    
    return this.http.post<UsersGroupsApi.Create.Response>(path, body);
  }

  update(params: UsersGroupsApi.Update.Params, body: UsersGroupsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + UsersGroupsApi.Update.path, params);

    return this.http.put<UsersGroupsApi.Update.Response>(path, body);
  }

  delete(params: UsersGroupsApi.Delete.Params) {
    const path = injectURLPayload(this.envServ.env.api + UsersGroupsApi.Delete.path, params);

    return this.http.delete<UsersGroupsApi.Delete.Response>(path);
  }
}