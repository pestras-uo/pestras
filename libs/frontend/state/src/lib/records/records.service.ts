import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { RecordsApi } from "./records.api";
import { injectURLPayload } from "@pestras/util";
import { DataRecord } from "@pestras/shared/data-model";
import { STATE_CONFIG, StateConfig } from "../config";

@Injectable({ providedIn: 'root' })
export class RecordsService {

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private http: HttpClient
  ) { }

  getBySerial<T = DataRecord>(params: RecordsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.config.api + RecordsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<RecordsApi.GetBySerial.Response<T>>(path);
  }

  search<T = DataRecord>(params: RecordsApi.Search.Params, body: RecordsApi.Search.Body) {
    const path = injectURLPayload(this.config.api + RecordsApi.Search.REQ_PATH, params);

    return this.http.post<RecordsApi.Search.Response<T>>(path, body);
  }

  create<T = DataRecord>(params: RecordsApi.Create.Params, body: RecordsApi.Create.Body) {
    const path = injectURLPayload(this.config.api + RecordsApi.Create.REQ_PATH, params);
    const data = new FormData();

    for (const key in body) {
      const value = body[key] ?? null;

      if (value) {
        if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof File))
          data.set(key, JSON.stringify(value));
        else
          data.set(key, value);
      }
    }

    return this.http.post<RecordsApi.Create.Response<T>>(path, data);
  }

  update<T = DataRecord>(params: RecordsApi.Update.Params, body: RecordsApi.Update.Body) {
    const path = injectURLPayload(this.config.api + RecordsApi.Update.REQ_PATH, params);

    return this.http.put<RecordsApi.Update.Response<T>>(path, body);
  }

  delete(params: RecordsApi.Delete.Params) {
    const path = injectURLPayload(this.config.api + RecordsApi.Delete.REQ_PATH, params);

    return this.http.delete<RecordsApi.Delete.Response>(path);
  }
}