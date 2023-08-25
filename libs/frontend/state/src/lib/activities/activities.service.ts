import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvService } from "@pestras/frontend/env";
import { ActivitesAPi } from "./activities.api";
import { injectURLPayload } from "@pestras/shared/util";

@Injectable()
export class ActivitiesService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) {}

  getLastWeek(params: ActivitesAPi.GetLastWeek.Params) {
    const path = injectURLPayload(this.envServ.env.api + ActivitesAPi.GetLastWeek.REQ_PATH, params);

    return this.http.get<ActivitesAPi.GetLastWeek.Response>(path);
  }

  getLastMonth(params: ActivitesAPi.GetLastMonth.Params) {
    const path = injectURLPayload(this.envServ.env.api + ActivitesAPi.GetLastMonth.REQ_PATH, params);

    return this.http.get<ActivitesAPi.GetLastMonth.Response>(path);
  }

  getLastYear(params: ActivitesAPi.GetLastYear.Params) {
    const path = injectURLPayload(this.envServ.env.api + ActivitesAPi.GetLastYear.REQ_PATH, params);

    return this.http.get<ActivitesAPi.GetLastYear.Response>(path);
  }
}