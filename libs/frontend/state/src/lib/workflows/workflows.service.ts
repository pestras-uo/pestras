import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvService } from "@pestras/frontend/env";
import { WorkflowsApi } from "./workflows.api";
import { injectURLPayload } from "@pestras/shared/util";

@Injectable()
export class WorkflowsService {

  constructor(
    private http: HttpClient,
    private envSrv: EnvService
  ) {}

  getBySerial(params: WorkflowsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envSrv.env.api + WorkflowsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<WorkflowsApi.GetBySerial.Response>(path);
  }

  getByBlueprint(params: WorkflowsApi.GetByBlueprint.Params) {
    const path = injectURLPayload(this.envSrv.env.api + WorkflowsApi.GetByBlueprint.REQ_PATH, params);

    return this.http.get<WorkflowsApi.GetByBlueprint.Response>(path);
  }

  create(body: WorkflowsApi.Create.Body) {
    const path = injectURLPayload(this.envSrv.env.api + WorkflowsApi.Create.REQ_PATH);

    return this.http.post<WorkflowsApi.Create.Response>(path, body);
  }

  updateName(params: WorkflowsApi.UpdateName.Params, body: WorkflowsApi.UpdateName.Body) {
    const path = injectURLPayload(this.envSrv.env.api + WorkflowsApi.UpdateName.REQ_PATH, params);

    return this.http.put<WorkflowsApi.UpdateName.Response>(path, body);
  }

  updateSteps(params: WorkflowsApi.UpdateSteps.Params, body: WorkflowsApi.UpdateSteps.Body) {
    const path = injectURLPayload(this.envSrv.env.api + WorkflowsApi.UpdateSteps.REQ_PATH, params);

    return this.http.put<WorkflowsApi.UpdateSteps.Response>(path, body);
  }
}