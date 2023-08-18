import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { WorkspaceApi } from "./workspace.api";
import { injectURLPayload } from "@pestras/shared/util";
import { STATE_CONFIG, StateConfig } from "../config";

@Injectable({ providedIn: 'root' })
export class WorkspaceService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) { }

  getByOwner() {
    const path = injectURLPayload(this.config.api + WorkspaceApi.GetByOwner.REQ_PATH);

    return this.http.get<WorkspaceApi.GetByOwner.Response>(path);
  }

  addGroup(body: WorkspaceApi.AddGroup.Body) {
    const path = injectURLPayload(this.config.api + WorkspaceApi.AddGroup.REQ_PATH);

    return this.http.post<WorkspaceApi.AddGroup.Response>(path, body);
  }

  updateGroup(params: WorkspaceApi.UpdateGroup.Params, body: WorkspaceApi.UpdateGroup.Body) {
    const path = injectURLPayload(this.config.api + WorkspaceApi.UpdateGroup.REQ_PATH, params);

    return this.http.put<WorkspaceApi.UpdateGroup.Response>(path, body);
  }

  removeGroup(params: WorkspaceApi.RemoveGroup.Params) {
    const path = injectURLPayload(this.config.api + WorkspaceApi.RemoveGroup.REQ_PATH, params);

    return this.http.delete<WorkspaceApi.RemoveGroup.Response>(path);
  }

  addPin(body: WorkspaceApi.AddPin.Body) {
    const path = injectURLPayload(this.config.api + WorkspaceApi.AddPin.REQ_PATH);

    return this.http.post<WorkspaceApi.AddPin.Response>(path, body);
  }

  removePin(params: WorkspaceApi.RemovePin.Params) {
    const path = injectURLPayload(this.config.api + WorkspaceApi.RemovePin.REQ_PATH, params);
    
    return this.http.delete<WorkspaceApi.RemovePin.Response>(path);
  }

  addSlide(body: WorkspaceApi.AddSlide.Body) {
    const path = injectURLPayload(this.config.api + WorkspaceApi.AddSlide.REQ_PATH);

    return this.http.post<WorkspaceApi.AddSlide.Response>(path, body);
  }

  removeSlide(params: WorkspaceApi.RemoveSlide.Params) {
    const path = injectURLPayload(this.config.api + WorkspaceApi.RemoveSlide.REQ_PATH, params);
    
    return this.http.delete<WorkspaceApi.RemoveSlide.Response>(path);
  }
}