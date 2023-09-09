import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataStoresApi } from './data-stores.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable()
export class DataStoresService {

  constructor(
    private envServ: EnvService,
    private readonly http: HttpClient
  ) {}

  // read
  // ------------------------------------------------------------------------------------------
  getBySerial(params: DataStoresApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.GetBySerial.REQ_PATH, params);

    return this.http.get<DataStoresApi.GetBySerial.Response>(path);
  }

  getByBlueprint(params: DataStoresApi.GetByBluePrint.Params) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.GetByBluePrint.REQ_PATH, params);

    return this.http.get<DataStoresApi.GetByBluePrint.Response>(path);
  }


  // create
  // ------------------------------------------------------------------------------------------
  create(data: DataStoresApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.Create.REQ_PATH);

    return this.http.post<DataStoresApi.Create.Response>(path, data);
  }


  // update
  // ------------------------------------------------------------------------------------------
  update(params: DataStoresApi.Update.Params, data: DataStoresApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.Update.REQ_PATH, params);

    return this.http.put<DataStoresApi.Update.Response>(path, data);
  }

  build(params: DataStoresApi.Build.Params) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.Build.REQ_PATH, params);

    return this.http.put<DataStoresApi.Build.Response>(path, null);
  }


  // table settings
  // ------------------------------------------------------------------------------------------
  setTableSettings(params: DataStoresApi.SetTableSettings.Params, data: DataStoresApi.SetTableSettings.Body) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetTableSettings.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetTableSettings.Response>(path, data);
  }


  // web service settings
  // ------------------------------------------------------------------------------------------
  setWebServiceSettings(
    params: DataStoresApi.SetWebServiceSettings.Params,
    data: DataStoresApi.SetWebServiceSettings.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetWebServiceSettings.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetWebServiceSettings.Response>(path, data);
  }

  setWebServiceAuth(
    params: DataStoresApi.SetWebServiceAuth.Params,
    data: DataStoresApi.SetWebServiceAuth.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetWebServiceAuth.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetWebServiceAuth.Response>(path, data);
  }

  removeWebServiceAuth(
    params: DataStoresApi.RemoveWebServiceAuth.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.RemoveWebServiceAuth.REQ_PATH, params);

    return this.http.delete<DataStoresApi.RemoveWebServiceAuth.Response>(path);
  }

  setWebServiceHeader(
    params: DataStoresApi.SetWebServiceHeader.Params,
    data: DataStoresApi.SetWebServiceHeader.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetWebServiceHeader.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetWebServiceHeader.Response>(path, data);
  }

  removeWebServiceHeader(
    params: DataStoresApi.RemoveWebServiceHeader.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.RemoveWebServiceHeader.REQ_PATH, params);

    return this.http.delete<DataStoresApi.RemoveWebServiceHeader.Response>(path);
  }

  addWebServiceQuery(
    params: DataStoresApi.AddWebServiceQuery.Params,
    data: DataStoresApi.AddWebServiceQuery.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.AddWebServiceQuery.REQ_PATH, params);

    return this.http.post<DataStoresApi.AddWebServiceQuery.Response>(path, data);
  }

  removeWebServiceQuery(
    params: DataStoresApi.RemoveWebServiceParam.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.RemoveWebServiceParam.REQ_PATH, params);

    return this.http.delete<DataStoresApi.RemoveWebServiceParam.Response>(path);
  }

  addWebServiceSelection(
    params: DataStoresApi.AddWebServiceSelection.Params,
    data: DataStoresApi.AddWebServiceSelection.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.AddWebServiceSelection.REQ_PATH, params);

    return this.http.post<DataStoresApi.AddWebServiceSelection.Response>(path, data);
  }

  removeWebServiceSelection(
    params: DataStoresApi.RemoveWebServiceSelection.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.RemoveWebServiceSelection.REQ_PATH, params);

    return this.http.delete<DataStoresApi.RemoveWebServiceSelection.Response>(path);
  }


  // aggregation
  // ------------------------------------------------------------------------------------------
  setAggregationSettings(
    params: DataStoresApi.SetAggregationSettings.Params,
    data: DataStoresApi.SetAggregationSettings.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetAggregationSettings.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetAggregationSettings.Response>(path, data);
  }


  // fields
  // ------------------------------------------------------------------------------------------
  addField(
    params: DataStoresApi.AddField.Params,
    data: DataStoresApi.AddField.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.AddField.REQ_PATH, params);

    return this.http.post<DataStoresApi.AddField.Response>(path, data);
  }

  updateField(
    params: DataStoresApi.UpdateField.Params,
    data: DataStoresApi.UpdateField.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.UpdateField.REQ_PATH, params);

    return this.http.put<DataStoresApi.UpdateField.Response>(path, data);
  }

  updateFieldConfig(
    params: DataStoresApi.UpdateFieldConfig.Params,
    data: DataStoresApi.UpdateFieldConfig.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.UpdateFieldConfig.REQ_PATH, params);

    return this.http.put<DataStoresApi.UpdateFieldConfig.Response>(path, data);
  }

  setFieldConstraint(
    params: DataStoresApi.SetFieldConstraint.Params,
    data: DataStoresApi.SetFieldConstraint.Body
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetFieldConstraint.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetFieldConstraint.Response>(path, data);
  }

  removeFieldConstraint(
    params: DataStoresApi.RemoveFieldConstraint.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.RemoveFieldConstraint.REQ_PATH, params);

    return this.http.delete<DataStoresApi.RemoveFieldConstraint.Response>(path);
  }

  removeField(
    params: DataStoresApi.RemoveField.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.RemoveField.REQ_PATH, params);

    return this.http.delete<DataStoresApi.RemoveField.Response>(path);
  }


  // owner & collaborators
  // ------------------------------------------------------------------------------------------
  setOwner(
    params: DataStoresApi.SetOwner.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetOwner.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetOwner.Response>(path, null);
  }

  addCollaborator(
    params: DataStoresApi.AddCollaborator.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.AddCollaborator.REQ_PATH, params);

    return this.http.post<DataStoresApi.AddCollaborator.Response>(path, null);
  }

  removeCollaborator(
    params: DataStoresApi.RemoveCollaborator.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.RemoveCollaborator.REQ_PATH, params);

    return this.http.delete<DataStoresApi.RemoveCollaborator.Response>(path);
  }


  // activation
  // ------------------------------------------------------------------------------------------
  setActivation(
    params: DataStoresApi.SetActiviation.Params
  ) {
    const path = injectURLPayload(this.envServ.env.api + DataStoresApi.SetActiviation.REQ_PATH, params);

    return this.http.put<DataStoresApi.SetActiviation.Response>(path, null);
  }
}