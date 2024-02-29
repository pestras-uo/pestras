import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntityAccessApi } from "./entity-access.api";
import { EnvService } from "@pestras/frontend/env";
import { injectURLPayload } from "@pestras/shared/util";

@Injectable()
export class EntityAccessService {

  constructor(
    private http: HttpClient,
    private envServ: EnvService
  ) {}

  getByEntity(params: EntityAccessApi.GetByEntity.Params) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.GetByEntity.path, params);

    return this.http.get<EntityAccessApi.GetByEntity.Response>(path);
  }

  allowGuests(params: EntityAccessApi.AllowGuests.Params, body: EntityAccessApi.AllowGuests.Body) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.AllowGuests.path, params);

    return this.http.put<EntityAccessApi.AllowGuests.Response>(path, body);
  }

  // Orgunits
  addOrgunit(params: EntityAccessApi.AddOrgunit.Params) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.AddOrgunit.path, params);

    return this.http.post<EntityAccessApi.AddOrgunit.Response>(path, null);
  }

  removeOrgunit(params: EntityAccessApi.RemoveOrgunit.Params) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.RemoveOrgunit.path, params);

    return this.http.delete<EntityAccessApi.RemoveOrgunit.Response>(path);
  }

  // Users
  addUser(params: EntityAccessApi.AddUser.Params) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.AddUser.path, params);

    return this.http.post<EntityAccessApi.AddUser.Response>(path, null);
  }
  removeUser(params: EntityAccessApi.RemoveUser.Params) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.RemoveUser.path, params);

    return this.http.delete<EntityAccessApi.RemoveUser.Response>(path);
  }

  // Groups
  addGroup(params: EntityAccessApi.AddGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.AddGroup.path, params);

    return this.http.post<EntityAccessApi.AddGroup.Response>(path, null);
  }
  removeGroup(params: EntityAccessApi.RemoveGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + EntityAccessApi.RemoveGroup.path, params);

    return this.http.delete<EntityAccessApi.RemoveGroup.Response>(path);
  }
}