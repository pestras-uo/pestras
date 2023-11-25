import { Injectable } from "@angular/core";
import { ApiQuery, Dashboard } from "@pestras/shared/data-model";
import { StatorChannel, StatorGroupState,  } from "@pestras/frontend/util/stator";
import { DashboardsService } from "./dashboards.service";
import { SessionEnd } from "../session/session.events";
import { Observable, tap } from "rxjs";
import { DashboardsApi } from "./dashboards.api";

@Injectable({ providedIn: 'root' })
export class DashboardsState extends StatorGroupState<Dashboard> {

  constructor(
    private service: DashboardsService,
    private channel: StatorChannel
  ) {
    super('dashboards', 'serial', 'topic', ['10m']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetch(serial: string): Observable<Dashboard | null> {
    return this.service.getBySerial({ serial });
  }

  protected override _fetchGroup(topic: string): Observable<Dashboard[]> {
    return this.service.getByScope({ topic });
  }

  search(query: Partial<ApiQuery<Dashboard>>) {
    return this.service.search(query);
  }

  count() {
    return this.service.count();
  }


  // change
  // -----------------------------------------------------------------------------------------
  create(topic: string | null, title: string) {
    return this.service.create({ topic, title })
      .pipe(tap(db => this._insert(db)));
  }

  update(serial: string, title: string) {
    return this.service.update({ serial }, { title })
      .pipe(tap(() => this._update(serial, { title })));
  }

  // slides
  // -----------------------------------------------------------------------------------------
  addSlide(serial: string, data: DashboardsApi.AddSlide.Body) {
    return this.service.addSlide({ serial }, data)
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res.date),
          slides_order: d.slides_order.concat(res.slide.serial),
          slides: d.slides.concat({ ...res.slide, views_order: [] })
        }
      })));
  }

  updateSlidesOrder(serial: string, slides: string[]) {
    return this.service.updateSlidesOrder({ serial }, { slides })
      .pipe(tap(res => this._update(serial, { slides_order: slides, last_modified: new Date(res) })))
  }

  updateSlide(serial: string, slide: string, data: DashboardsApi.UpdateSlide.Body) {
    return this.service.updateSlide({ serial, slide }, data)
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res),
          slides: d.slides.map(t => {
            return t.serial !== slide
              ? t
              : { ...t, ...data }
          })
        };
      })));
  }

  removeSlide(serial: string, slide: string) {
    return this.service.removeSlide({ serial, slide })
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res),
          slides_order: d.slides_order.filter(t => t !== slide),
          slide: d.slides.filter(t => t.serial !== slide)
        }
      })));
  }

  // views
  // -----------------------------------------------------------------------------------------
  addView(serial: string, data: DashboardsApi.AddView.Body) {
    return this.service.addView({ serial }, data)
      .pipe(
        tap(res => this._update(serial, d => {
          return {
            ...d,
            last_modified: new Date(res.date),
            views: [...d.views, res.view],
            slides: d.slides.map(t => {
              if (t.serial !== data.slide)
                return t;

              return {
                ...t,
                views_order: t.views_order.concat(res.view.serial)
              };
            })
          };
        }))
      );
  }

  setViewDataViz(serial: string, view: string, dataViz: string) {
    return this.service.updateViewDataViz({ serial, view, dataViz })
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res),
          views: d.views.map(v => {
            if (v.serial !== view)
              return v;

            return {
              ...v,
              data_viz: dataViz
            };
          })
        }
      })));
  }

  updateViewsOrder(serial: string, slide: string, views: string[]) {
    return this.service.updateViewsOrder({ serial, slide }, { views })
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res),
          slides: d.slides.map(t => {
            return t.serial !== slide
              ? t
              : { ...t, views_order: views };
          })
        };
      })));
  }

  updateView(serial: string, view: string, data: DashboardsApi.UpdateView.Body) {
    return this.service.updateView({ serial, view }, data)
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res),
          views: d.views.map(v => {
            if (v.serial !== view)
              return v;

            return {
              ...v,
              size: data.size
            }
          })
        };
      })));
  }

  removeView(serial: string, view: string) {
    return this.service.removeView({ serial, view })
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res),
          views: d.views.filter(v => v.serial !== view),
          slides: d.slides.map(s => {
            if (!s.views_order.includes(view))
              return s;

            return {
              ...s,
              views_order: s.views_order.filter(v => v !== view),
            };
          })
        };
      })));
  }
}