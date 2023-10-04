import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { injectURLPayload } from "@pestras/shared/util";
import { CommentsApi } from "./comments.api";
import { EnvService } from "@pestras/frontend/env";

@Injectable()
export class CommentsService {

  constructor(
    private envServ: EnvService,
    private readonly http: HttpClient
  ) {}


  
  getAll(params: CommentsApi.GetAll.Params) {
    const path = injectURLPayload(this.envServ.env.api + CommentsApi.GetAll.path, params);

    return this.http.get<CommentsApi.GetAll.Response>(path);
  }


//   getBySerial(params: CommentsApi.GetBySerial.Params) {
//     const path = injectURLPayload(this.envServ.env.api + CommentsApi.GetBySerial.path, params);

//     return this.http.get<CommentsApi.GetBySerial.Response>(path);
//   }

//   getByBlueprint(params: CommentsApi.GetByBlueprint.Params) {
//     const path = injectURLPayload(this.envServ.env.api + CommentsApi.GetByBlueprint.path, params);

//     return this.http.get<CommentsApi.GetByBlueprint.Response>(path);
//   }

  create(params: CommentsApi.Create.Params,data: CommentsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + CommentsApi.Create.path,params);

    return this.http.post<CommentsApi.Create.Response>(path, data);
  }

  update(params: CommentsApi.Update.Params, data: CommentsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + CommentsApi.Update.path, params);

    return this.http.put<CommentsApi.Update.Response>(path, data);
  }

  delete(params: CommentsApi.Delete.Params) {
    const path = injectURLPayload(this.envServ.env.api + CommentsApi.Delete.path, params);

    return this.http.delete<CommentsApi.Delete.Response>(path);
  }
}