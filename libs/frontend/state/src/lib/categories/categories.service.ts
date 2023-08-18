import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { injectURLPayload } from "@pestras/util";
import { CategoriesApi } from "./categories.api";
import { STATE_CONFIG, StateConfig } from "../config";

@Injectable({ providedIn: 'root' })
export class CategoriesService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private readonly http: HttpClient
  ) {}

  getAll() {
    return this.http.get<CategoriesApi.GetAll.Response>(injectURLPayload(CategoriesApi.GetAll.path));
  }

  getBySerial(params: CategoriesApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + CategoriesApi.GetBySerial.path, params);

    return this.http.get<CategoriesApi.GetBySerial.Response>(path);
  }

  create(data: CategoriesApi.Create.Body) {
    const path = injectURLPayload(this.config.api + CategoriesApi.Create.path);

    return this.http.post<CategoriesApi.Create.Response>(path, data);
  }

  update(params: CategoriesApi.Update.Params, data: CategoriesApi.Update.Body) {
    const path = injectURLPayload(this.config.api + CategoriesApi.Update.path, params);

    return this.http.put<CategoriesApi.Update.Response>(path, data);
  }

  removeBranch(params: CategoriesApi.Delete.Params) {
    const path = injectURLPayload(this.config.api + CategoriesApi.Delete.path, params);

    return this.http.delete<CategoriesApi.Delete.Response>(path);
  }
}