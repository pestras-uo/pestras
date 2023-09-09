import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { injectURLPayload } from "@pestras/shared/util";
import { CategoriesApi } from "./categories.api";
import { EnvService } from "@pestras/frontend/env";

@Injectable()
export class CategoriesService {

  constructor(
    private envServ: EnvService,
    private readonly http: HttpClient
  ) {}

  getAll() {
    const path = injectURLPayload(this.envServ.env.api + CategoriesApi.GetAll.path);

    return this.http.get<CategoriesApi.GetAll.Response>(injectURLPayload(path));
  }

  getBySerial(params: CategoriesApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + CategoriesApi.GetBySerial.path, params);

    return this.http.get<CategoriesApi.GetBySerial.Response>(path);
  }

  getByBlueprint(params: CategoriesApi.GetByBlueprint.Params) {
    const path = injectURLPayload(this.envServ.env.api + CategoriesApi.GetByBlueprint.path, params);

    return this.http.get<CategoriesApi.GetByBlueprint.Response>(path);
  }

  create(data: CategoriesApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + CategoriesApi.Create.path);

    return this.http.post<CategoriesApi.Create.Response>(path, data);
  }

  update(params: CategoriesApi.Update.Params, data: CategoriesApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + CategoriesApi.Update.path, params);

    return this.http.put<CategoriesApi.Update.Response>(path, data);
  }

  removeBranch(params: CategoriesApi.Delete.Params) {
    const path = injectURLPayload(this.envServ.env.api + CategoriesApi.Delete.path, params);

    return this.http.delete<CategoriesApi.Delete.Response>(path);
  }
}