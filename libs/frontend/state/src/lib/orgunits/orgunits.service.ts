import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { injectURLPayload } from "@pestras/shared/util";
import { OrgunitsApi } from "./orgunits.api";
import { EnvService } from "@pestras/frontend/env";

@Injectable()
export class OrgunitsService {

  constructor(
    private envServ: EnvService,
    private readonly http: HttpClient
  ) { }

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.GetAll.path);
    
    return this.http.get<OrgunitsApi.GetAll.Response>(path);
  }

  getBySerial(params: OrgunitsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.GetBySerial.path, params);

    return this.http.get<OrgunitsApi.GetBySerial.Response>(path);
  }

  create(data: OrgunitsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.Create.path);

    return this.http.post<OrgunitsApi.Create.Response>(path, data);
  }

  update(params: OrgunitsApi.Update.Params, data: OrgunitsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.Update.path, params);

    return this.http.put<OrgunitsApi.Update.Response>(path, data);
  }

  updateLogo(params: OrgunitsApi.UpdateLogo.Params, data: OrgunitsApi.UpdateLogo.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.UpdateLogo.path, params);

    const form = new FormData();
    form.append('logo', data.logo);

    return this.http.post<OrgunitsApi.UpdateLogo.Response>(path, form);
  }

  removeLogo(params: OrgunitsApi.RemoveLogo.Params) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.RemoveLogo.path, params);

    return this.http.delete<OrgunitsApi.RemoveLogo.Response>(path);
  }

  updateRegions(params: OrgunitsApi.UpdateRegions.Params, data: OrgunitsApi.UpdateRegions.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.UpdateRegions.path, params);

    return this.http.put<OrgunitsApi.UpdateRegions.Response>(path, data);
  }
}