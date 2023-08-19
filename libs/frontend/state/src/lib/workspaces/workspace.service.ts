import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WorkspaceApi } from "./workspace.api";
import { injectURLPayload } from "@pestras/shared/util";
import { EnvService } from "@pestras/frontend/env";

@Injectable({ providedIn: 'root' })
export class WorkspaceService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  getByOwner() {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.GetByOwner.REQ_PATH);

    return this.http.get<WorkspaceApi.GetByOwner.Response>(path);
  }

  addGroup(body: WorkspaceApi.AddGroup.Body) {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.AddGroup.REQ_PATH);

    return this.http.post<WorkspaceApi.AddGroup.Response>(path, body);
  }

  updateGroup(params: WorkspaceApi.UpdateGroup.Params, body: WorkspaceApi.UpdateGroup.Body) {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.UpdateGroup.REQ_PATH, params);

    return this.http.put<WorkspaceApi.UpdateGroup.Response>(path, body);
  }

  removeGroup(params: WorkspaceApi.RemoveGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.RemoveGroup.REQ_PATH, params);

    return this.http.delete<WorkspaceApi.RemoveGroup.Response>(path);
  }

  addPin(body: WorkspaceApi.AddPin.Body) {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.AddPin.REQ_PATH);

    return this.http.post<WorkspaceApi.AddPin.Response>(path, body);
  }

  removePin(params: WorkspaceApi.RemovePin.Params) {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.RemovePin.REQ_PATH, params);
    
    return this.http.delete<WorkspaceApi.RemovePin.Response>(path);
  }

  addSlide(body: WorkspaceApi.AddSlide.Body) {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.AddSlide.REQ_PATH);

    return this.http.post<WorkspaceApi.AddSlide.Response>(path, body);
  }

  removeSlide(params: WorkspaceApi.RemoveSlide.Params) {
    const path = injectURLPayload(this.envServ.env.api + WorkspaceApi.RemoveSlide.REQ_PATH, params);
    
    return this.http.delete<WorkspaceApi.RemoveSlide.Response>(path);
  }
}