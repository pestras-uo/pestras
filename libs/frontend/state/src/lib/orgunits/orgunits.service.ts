import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { injectURLPayload } from "@pestras/shared/util";
import { EnvService } from "@pestras/frontend/env";
import { OrgunitsApi } from "@pestras/shared/data-model";

@Injectable()
export class OrgunitsService {

  constructor(
    private envServ: EnvService,
    private readonly http: HttpClient
  ) { }

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.GetAll.REQ_FULL_PATH);

    return this.http[OrgunitsApi.GetAll.REQ_METHOD]<OrgunitsApi.GetAll.Response>(path);
  }

  getBySerial(params: OrgunitsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.GetBySerial.REQ_FULL_PATH, params);

    return this.http[OrgunitsApi.GetBySerial.REQ_METHOD]<OrgunitsApi.GetBySerial.Response>(path);
  }

  create(data: OrgunitsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.Create.REQ_FULL_PATH);

    return this.http.post<OrgunitsApi.Create.Response>(path, data);
  }

  update(params: OrgunitsApi.Update.Params, data: OrgunitsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.Update.REQ_FULL_PATH, params);

    return this.http[OrgunitsApi.Update.REQ_METHOD]<OrgunitsApi.Update.Response>(path, data);
  }

  updateLogo(params: OrgunitsApi.UpdateLogo.Params, data: OrgunitsApi.UpdateLogo.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.UpdateLogo.REQ_FULL_PATH, params);

    const form = new FormData();
    form.append('logo', data.logo);

    return this.http[OrgunitsApi.UpdateLogo.REQ_METHOD]<OrgunitsApi.UpdateLogo.Response>(path, form);
  }

  removeLogo(params: OrgunitsApi.RemoveLogo.Params) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.RemoveLogo.REQ_FULL_PATH, params);

    return this.http[OrgunitsApi.RemoveLogo.REQ_METHOD]<OrgunitsApi.RemoveLogo.Response>(path);
  }

  updateRegions(params: OrgunitsApi.UpdateRegions.Params, data: OrgunitsApi.UpdateRegions.Body) {
    const path = injectURLPayload(this.envServ.env.api + OrgunitsApi.UpdateRegions.REQ_FULL_PATH, params);

    return this.http[OrgunitsApi.UpdateRegions.REQ_METHOD]<OrgunitsApi.UpdateRegions.Response>(path, data);
  }
}