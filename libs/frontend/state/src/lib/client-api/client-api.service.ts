import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ClientApiApi } from "./client-api.api";
import { injectURLPayload } from "@pestras/shared/util";
import { STATE_CONFIG, StateConfig } from "../config";

@Injectable({ providedIn: 'root' })
export class ClientApiService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) {}

  getByBlueprint(params: ClientApiApi.GetByBlueprint.Params) {
    const path = injectURLPayload(this.config.api + ClientApiApi.GetByBlueprint.path, params)
    return this.http.get<ClientApiApi.GetByBlueprint.Response>(path);
  }

  getBySerial(params: ClientApiApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + ClientApiApi.GetBySerial.path, params);

    return this.http.get<ClientApiApi.GetBySerial.Response>(path);
  }



  create(body: ClientApiApi.Create.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.Create.path);

    return this.http.post<ClientApiApi.Create.Response>(path, body);
  }



  update(params: ClientApiApi.Update.Params, body: ClientApiApi.Update.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.Update.path, params);

    return this.http.put<ClientApiApi.Update.Response>(path, body);
  }



  addIP(params: ClientApiApi.AddIP.Params, body: ClientApiApi.AddIP.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.AddIP.path, params);

    return this.http.post<ClientApiApi.AddIP.Response>(path, body);
  }

  removeIP(params: ClientApiApi.RemoveIP.Params, body: ClientApiApi.RemoveIP.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.RemoveIP.path, params);

    return this.http.put<ClientApiApi.RemoveIP.Response>(path, body);
  }



  addDataStore(params: ClientApiApi.AddDataStore.Params, body: ClientApiApi.AddDataStore.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.AddDataStore.path, params);

    return this.http.post<ClientApiApi.AddDataStore.Response>(path, body);
  }

  updateDataStore(params: ClientApiApi.UpdateDataStore.Params, body: ClientApiApi.UpdateDataStore.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.UpdateDataStore.path, params);

    return this.http.put<ClientApiApi.UpdateDataStore.Response>(path, body);
  }

  removeDataStore(params: ClientApiApi.RemoveDataStore.Params) {
    const path = injectURLPayload(this.config.api + ClientApiApi.RemoveDataStore.path, params);

    return this.http.delete<ClientApiApi.RemoveDataStore.Response>(path);
  }



  addParam(params: ClientApiApi.AddParam.Params, body: ClientApiApi.AddParam.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.AddParam.path, params);

    return this.http.post<ClientApiApi.AddParam.Response>(path, body);
  }

  updateParam(params: ClientApiApi.UpdateParam.Params, body: ClientApiApi.UpdateParam.Body) {
    const path = injectURLPayload(this.config.api + ClientApiApi.UpdateParam.path, params);

    return this.http.put<ClientApiApi.UpdateParam.Response>(path, body);
  }

  removeParam(params: ClientApiApi.RemoveParam.Params) {
    const path = injectURLPayload(this.config.api + ClientApiApi.RemoveParam.path, params);

    return this.http.delete<ClientApiApi.RemoveParam.Response>(path);
  }



  delete(params: ClientApiApi.Delete.Params) {
    const path = injectURLPayload(this.config.api + ClientApiApi.Delete.path, params);

    return this.http.delete<ClientApiApi.Delete.Response>(path);
  }
}