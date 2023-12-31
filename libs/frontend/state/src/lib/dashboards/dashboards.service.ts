import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardsApi } from './dashboards.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable()
export class DashboardsService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) { }


  // Read
  // ---------------------------------------------------------------------------------
  getByScope(params: DashboardsApi.GetByScope.Params) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.GetByScope.REQ_PATH, params);

    return this.http.get<DashboardsApi.GetByScope.Response>(path);
  }

  getBySerial(params: DashboardsApi.GetBySerial.Params) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.GetBySerial.REQ_PATH, params);

    return this.http.get<DashboardsApi.GetBySerial.Response>(path);
  }

  search(body: DashboardsApi.Search.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.Search.REQ_PATH);

    return this.http.post<DashboardsApi.Search.Response>(path, body);
  }

  count() {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.Count.REQ_PATH);

    return this.http.get<DashboardsApi.Count.Response>(path);
  }


  // Create
  // ---------------------------------------------------------------------------------
  create(body: DashboardsApi.Create.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.Create.REQ_PATH);

    return this.http.post<DashboardsApi.Create.Response>(path, body);
  }


  // Update
  // ---------------------------------------------------------------------------------
  update(params: DashboardsApi.Update.Params, body: DashboardsApi.Update.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.Update.REQ_PATH, params);

    return this.http.put<DashboardsApi.Update.Response>(path, body);
  }


  // Slides
  // ---------------------------------------------------------------------------------
  addSlide(params: DashboardsApi.AddSlide.Params, body: DashboardsApi.AddSlide.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.AddSlide.REQ_PATH, params);

    return this.http.post<DashboardsApi.AddSlide.Response>(path, body);
  }

  updateSlidesOrder(params: DashboardsApi.UpdateSlidesOrder.Params, body: DashboardsApi.UpdateSlidesOrder.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.UpdateSlidesOrder.REQ_PATH, params);

    return this.http.put<DashboardsApi.UpdateSlidesOrder.Response>(path, body);
  }

  updateSlide(params: DashboardsApi.UpdateSlide.Params, body: DashboardsApi.UpdateSlide.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.UpdateSlide.REQ_PATH, params);

    return this.http.put<DashboardsApi.UpdateSlide.Response>(path, body);
  }

  removeSlide(params: DashboardsApi.RemoveSlide.Params) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.RemoveSlide.REQ_PATH, params);

    return this.http.delete<DashboardsApi.RemoveSlide.Response>(path);
  }


  // Views
  // ---------------------------------------------------------------------------------
  addView(params: DashboardsApi.AddView.Params, body: DashboardsApi.AddView.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.AddView.REQ_PATH, params);

    return this.http.post<DashboardsApi.AddView.Response>(path, body);
  }

  updateViewDataViz(params: DashboardsApi.UpdateViewDataViz.Params) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.UpdateViewDataViz.REQ_PATH, params);

    return this.http.put<DashboardsApi.UpdateViewDataViz.Response>(path, {});
  }

  updateViewsOrder(params: DashboardsApi.UpdateViewsOrder.Params, body: DashboardsApi.UpdateViewsOrder.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.UpdateViewsOrder.REQ_PATH, params);

    return this.http.put<DashboardsApi.UpdateViewsOrder.Response>(path, body);
  }

  updateView(params: DashboardsApi.UpdateView.Params, body: DashboardsApi.UpdateView.Body) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.UpdateView.REQ_PATH, params);

    return this.http.put<DashboardsApi.UpdateView.Response>(path, body);
  }

  removeView(params: DashboardsApi.RemoveView.Params) {
    const path = injectURLPayload(this.envServ.env.api + DashboardsApi.RemoveView.REQ_PATH, params);

    return this.http.delete<DashboardsApi.RemoveView.Response>(path);
  }
}