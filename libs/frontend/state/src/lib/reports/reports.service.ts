import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { injectURLPayload } from '@pestras/shared/util';
import { ReportsApi } from './reports.api';
import { EnvService } from '@pestras/frontend/env';

@Injectable()
export class ReportsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }


  // Read
  // ---------------------------------------------------------------------------------
  getByScope(params: ReportsApi.GetByScope.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.GetByScope.REQ_PATH, params);

    return this.http.get<ReportsApi.GetByScope.Response>(path);
  }

  getBySerial(params: ReportsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<ReportsApi.GetBySerial.Response>(path);
  }


  // Create
  // ---------------------------------------------------------------------------------
  create(body: ReportsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.Create.REQ_PATH);

    return this.http.post<ReportsApi.Create.Response>(path, body);
  }


  // Update
  // ---------------------------------------------------------------------------------
  update(params: ReportsApi.Update.Params, body: ReportsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.Update.REQ_PATH, params);

    return this.http.put<ReportsApi.Update.Response>(path, body);
  }


  // Slides
  // ---------------------------------------------------------------------------------
  addSlide(params: ReportsApi.AddSlide.Params, body: ReportsApi.AddSlide.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.AddSlide.REQ_PATH, params);

    return this.http.post<ReportsApi.AddSlide.Response>(path, body);
  }

  updateSlidesOrder(params: ReportsApi.UpdateSlidesOrder.Params, body: ReportsApi.UpdateSlidesOrder.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.UpdateSlidesOrder.REQ_PATH, params);

    return this.http.put<ReportsApi.UpdateSlidesOrder.Response>(path, body);
  }

  updateSlide(params: ReportsApi.UpdateSlide.Params, body: ReportsApi.UpdateSlide.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.UpdateSlide.REQ_PATH, params);

    return this.http.put<ReportsApi.UpdateSlide.Response>(path, body);
  }

  removeSlide(params: ReportsApi.RemoveSlide.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.RemoveSlide.REQ_PATH, params);

    return this.http.delete<ReportsApi.RemoveSlide.Response>(path);
  }


  // Views
  // ---------------------------------------------------------------------------------
  addView(params: ReportsApi.AddView.Params, body: ReportsApi.AddView.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.AddView.REQ_PATH, params);

    return this.http.post<ReportsApi.AddView.Response>(path, body);
  }

  updateViewContent(params: ReportsApi.UpdateViewContent.Params, body: ReportsApi.UpdateViewContent.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.UpdateViewContent.REQ_PATH, params);

    return this.http.put<ReportsApi.UpdateViewContent.Response>(path, body);
  }

  updateViewImage(params: ReportsApi.UpdateViewContentImage.Params, body: ReportsApi.UpdateViewContentImage.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.UpdateViewContentImage.REQ_PATH, params);
    const data = new FormData();

    data.set('image', body.image);

    return this.http.put<ReportsApi.UpdateViewContentImage.Response>(path, data);
  }

  updateViewsOrder(params: ReportsApi.UpdateViewsOrder.Params, body: ReportsApi.UpdateViewsOrder.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.UpdateViewsOrder.REQ_PATH, params);

    return this.http.put<ReportsApi.UpdateViewsOrder.Response>(path, body);
  }

  updateView(params: ReportsApi.UpdateView.Params, body: ReportsApi.UpdateView.Body) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.UpdateView.REQ_PATH, params);

    return this.http.put<ReportsApi.UpdateView.Response>(path, body);
  }

  removeView(params: ReportsApi.RemoveView.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.RemoveView.REQ_PATH, params);

    return this.http.delete<ReportsApi.RemoveView.Response>(path);
  }

  // access
  // ---------------------------------------------------------------------------------------------------
  // Orgunits
  addAccessOrgunit(params: ReportsApi.AddAccessOrgunit.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.AddAccessOrgunit.path, params);

    return this.http.post<ReportsApi.AddAccessOrgunit.Response>(path, null);
  }

  removeAccessOrgunit(params: ReportsApi.RemoveAccessOrgunit.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.RemoveAccessOrgunit.path, params);

    return this.http.delete<ReportsApi.RemoveAccessOrgunit.Response>(path);
  }

  // Users
  addAccessUser(params: ReportsApi.AddAccessUser.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.AddAccessUser.path, params);

    return this.http.post<ReportsApi.AddAccessUser.Response>(path, null);
  }
  removeAccessUser(params: ReportsApi.RemoveAccessUser.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.RemoveAccessUser.path, params);

    return this.http.delete<ReportsApi.RemoveAccessUser.Response>(path);
  }

  // Groups
  addAccessGroup(params: ReportsApi.AddAccessGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.AddAccessGroup.path, params);

    return this.http.post<ReportsApi.AddAccessGroup.Response>(path, null);
  }
  removeAccessGroup(params: ReportsApi.RemoveAccessGroup.Params) {
    const path = injectURLPayload(this.envServ.env.api + ReportsApi.RemoveAccessGroup.path, params);

    return this.http.delete<ReportsApi.RemoveAccessGroup.Response>(path);
  }
}