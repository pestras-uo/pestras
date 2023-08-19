import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContentApi } from './content.api';
import { injectURLPayload } from '@pestras/shared/util';
import { EnvService } from '@pestras/frontend/env';

@Injectable({ providedIn: 'root' })
export class ContentService {

  constructor(
    private envServ: EnvService,
    private http: HttpClient
  ) {}

  getByEntity(params: ContentApi.GetByEntity.Params) {
    const path = injectURLPayload(this.envServ.env.api + ContentApi.GetByEntity.REQ_PATH, params);

    return this.http.get<ContentApi.GetByEntity.Response>(path);
  }

  addView(params: ContentApi.addView.Params, body: ContentApi.addView.Body) {
    const path = injectURLPayload(this.envServ.env.api + ContentApi.addView.REQ_PATH, params);
    const form = new FormData();

    body.title && form.append('title', body.title)
    body.sub_title && form.append('sub_title', body.sub_title)
    body.content && form.append('content', body.content)
    body.image && form.append('image', body.image)
    form.append('type', body.type);

    return this.http.post<ContentApi.addView.Response>(path, form);
  }

  updateViewsOrder(params: ContentApi.UpdateViewsOrder.Params, body: ContentApi.UpdateViewsOrder.Body) {
    const path = injectURLPayload(this.envServ.env.api + ContentApi.UpdateViewsOrder.REQ_PATH, params);

    return this.http.put<ContentApi.UpdateViewsOrder.Response>(path, body);
  }

  updateView(params: ContentApi.UpdateView.Params, body: ContentApi.UpdateView.Body) {
    const path = injectURLPayload(this.envServ.env.api + ContentApi.UpdateView.REQ_PATH, params);

    return this.http.put<ContentApi.UpdateView.Response>(path, body);
  }

  updateViewContent(params: ContentApi.UpdateViewContent.Params, body: ContentApi.UpdateViewContent.Body) {
    const path = injectURLPayload(this.envServ.env.api + ContentApi.UpdateViewContent.REQ_PATH, params);
    const form = new FormData();

    body.content && form.append('content', body.content)
    body.image && form.append('image', body.image)

    return this.http.put<ContentApi.UpdateViewContent.Response>(path, form);
  }

  removeView(params: ContentApi.RemoveView.Params) {
    const path = injectURLPayload(this.envServ.env.api + ContentApi.RemoveView.REQ_PATH, params);

    return this.http.delete<ContentApi.RemoveView.Response>(path);
  }
}