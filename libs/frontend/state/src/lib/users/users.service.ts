import { Injectable } from '@angular/core';
import { UsersApi } from './users.api';
import { HttpClient } from '@angular/common/http';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable({ providedIn: 'root' })
export class UsersService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.GetAll.path);
    return this.http.get<UsersApi.GetAll.Response>(path);
  }

  getBySerial(params: UsersApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.GetBySerial.path, params);
    return this.http.get<UsersApi.GetBySerial.Response>(path);
  }

  create(data: UsersApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.Create.path);

    return this.http.post<UsersApi.Create.Response>(path, data);
  }

  updateRoles(params: UsersApi.UpdateRoles.Params, body: UsersApi.UpdateRoles.Body) {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.UpdateRoles.path, params);

    return this.http.put<UsersApi.UpdateRoles.Response>(path, body);
  }

  addGroup(params: UsersApi.AddGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.AddGroup.path, params);

    return this.http.post<UsersApi.AddGroup.Response>(path, null);
  }

  removeGroup(params: UsersApi.RemoveGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.RemoveGroup.path, params);

    return this.http.delete<UsersApi.RemoveGroup.Response>(path);
  }

  addAlternative(params: UsersApi.AddAlternative.Params) {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.AddAlternative.path, params);

    return this.http.post<UsersApi.AddAlternative.Response>(path, null);
  }

  removeAlternative(params: UsersApi.RemoveAlternative.Params) {
    const path = injectURLPayload(this.envServ.env.api + UsersApi.RemoveAlternative.path, params);

    return this.http.delete<UsersApi.RemoveAlternative.Response>(path);
  }
}