import { Injectable } from '@angular/core';
import { EntityContentViews } from '@pestras/shared/data-model';
import { tap } from 'rxjs';
import { StatorChannel, StatorQueryState } from '@pestras/frontend/util/stator';
import { ContentService } from './content.service';
import { SessionEnd } from '../session/session.events';
import { ContentApi } from './content.api';

@Injectable({ providedIn: 'root' })
export class ContentState extends StatorQueryState<EntityContentViews> {

  constructor(
    private service: ContentService,
    private channel: StatorChannel
  ) {
    super('content-views', 'entity', ['10m'], true);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetchDoc(entity: string) {
    return this.service.getByEntity({ entity });
  }

  addView(entity: string, data: ContentApi.addView.Body) {
    return this.service.addView({ entity }, data)
      .pipe(tap(v => this._update(entity, c => {
        return {
          ...c,
          views: c.views.concat(v),
          views_order: c.views_order.concat(v.serial)
        }
      })));
  }

  updateOrder(entity: string, views: string[]) {
    return this.service.updateViewsOrder({ entity }, { views })
      .pipe(tap(() => this._update(entity, { views_order: views })));
  }

  updateView(entity: string, view: string, data: ContentApi.UpdateView.Body) {
    return this.service.updateView({ entity, view }, data)
      .pipe(tap(() => this._update(entity, c => {
        return {
          ...c,
          views: c.views.map(v => v.serial !== view ? v : { ...v, ...data })
        }
      })))
  }

  updateViewContent(entity: string, view: string, data: ContentApi.UpdateViewContent.Body) {
    return this.service.updateViewContent({ entity, view }, data)
      .pipe(tap(path => this._update(entity, c => {
        return {
          ...c,
          views: c.views.map(v => v.serial !== view ? v : { ...v, content: path ?? data.content })
        }
      })))
  }

  removeView(entity: string, view: string) {
    return this.service.removeView({ entity, view })
      .pipe(tap(() => this._update(entity, c => {
        return {
          ...c,
          views: c.views.filter(v => v.serial !== view),
          views_order: c.views_order.filter(v => v !== view)
        };
      })));
  }
}