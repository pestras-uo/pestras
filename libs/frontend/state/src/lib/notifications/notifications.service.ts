import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationsApi } from "./notifications.api";
import { EnvService } from "@pestras/frontend/env";
import { injectURLPayload } from "@pestras/shared/util";

@Injectable()
export class NotificationsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + NotificationsApi.GetAll.REQ_PATH);

    return this.http.get<NotificationsApi.GetAll.Response>(path);
  }

  setSeen(params: NotificationsApi.SetSeen.Params) {
    const path = injectURLPayload(this.envServ.env.api + NotificationsApi.SetSeen.REQ_PATH, params);

    return this.http.put<NotificationsApi.SetSeen.Response>(path, null);
  }
}