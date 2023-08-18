import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { injectURLPayload } from "@pestras/util";
import { OrgunitsApi } from "./orgunits.api";
import { STATE_CONFIG, StateConfig } from "../config";

@Injectable({ providedIn: 'root' })
export class OrgunitsService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private readonly http: HttpClient
  ) { }

  getAll() {
    const path = injectURLPayload(this.config.api + OrgunitsApi.GetAll.path);
    
    return this.http.get<OrgunitsApi.GetAll.Response>(path);
  }

  getBySerial(params: OrgunitsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + OrgunitsApi.GetBySerial.path, params);

    return this.http.get<OrgunitsApi.GetBySerial.Response>(path);
  }

  create(data: OrgunitsApi.Create.Body) {
    const path = injectURLPayload(this.config.api + OrgunitsApi.Create.path);

    return this.http.post<OrgunitsApi.Create.Response>(path, data);
  }

  update(params: OrgunitsApi.Update.Params, data: OrgunitsApi.Update.Body) {
    const path = injectURLPayload(this.config.api + OrgunitsApi.Update.path, params);

    return this.http.put<OrgunitsApi.Update.Response>(path, data);
  }

  updateLogo(params: OrgunitsApi.UpdateLogo.Params, data: OrgunitsApi.UpdateLogo.Body) {
    const path = injectURLPayload(this.config.api + OrgunitsApi.UpdateLogo.path, params);

    const form = new FormData();
    form.append('logo', data.logo);

    return this.http.post<OrgunitsApi.UpdateLogo.Response>(path, form);
  }

  removeLogo(params: OrgunitsApi.RemoveLogo.Params) {
    const path = injectURLPayload(this.config.api + OrgunitsApi.RemoveLogo.path, params);

    return this.http.delete<OrgunitsApi.RemoveLogo.Response>(path);
  }
}