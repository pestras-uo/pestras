import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecordsApi } from "./records.api";
import { injectURLPayload } from "@pestras/shared/util";
import { EnvService } from "@pestras/frontend/env";

export { DataRecordsSearchResponse } from './records.api';

@Injectable()
export class RecordsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }

  getBySerial(params: RecordsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<RecordsApi.GetBySerial.Response>(path);
  }

  search(params: RecordsApi.Search.Params, body: RecordsApi.Search.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.Search.REQ_PATH, params);

    return this.http.post<RecordsApi.Search.Response>(path, body);
  }

  getCategoryValues(params: RecordsApi.GetCategoryValues.Params, body: RecordsApi.GetCategoryValues.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.GetCategoryValues.REQ_PATH, params);

    return this.http.post<RecordsApi.GetCategoryValues.Response>(path, body);
  }

  getHistory(params: RecordsApi.getHistory.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.getHistory.REQ_PATH, params);

    return this.http.get<RecordsApi.getHistory.Response>(path);
  }

  create(params: RecordsApi.Create.Params, body: RecordsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.Create.REQ_PATH, params);
    const data = new FormData();

    for (const key in body) {
      const value = body[key] ?? null;

      if (value !== null) {
        if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof File))
          data.set(key, JSON.stringify(value));
        else
          data.set(key, value);
      }
    }

    return this.http.post<RecordsApi.Create.Response>(path, data);
  }

  update(params: RecordsApi.Update.Params, body: RecordsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.Update.REQ_PATH, params);

    const data = new FormData();

    for (const key in body) {
      const value = body[key] ?? null;

      if (value !== null) {
        if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof File))
          data.set(key, JSON.stringify(value));
        else
          data.set(key, value);
      }
    }

    return this.http.put<RecordsApi.Update.Response>(path, data);
  }
  
  revertHistory(params: RecordsApi.RevertHistory.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.RevertHistory.REQ_PATH, params);

    return this.http.put<RecordsApi.RevertHistory.Response>(path, null);
  }

  delete(params: RecordsApi.Delete.Params) {
    const path = injectURLPayload(this.envServ.env.api + RecordsApi.Delete.REQ_PATH, params);

    return this.http.delete<RecordsApi.Delete.Response>(path);
  }
}