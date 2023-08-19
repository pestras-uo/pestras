import { Injectable } from "@angular/core";
import { Dashboard } from "@pestras/shared/data-model";
import { StatorChannel, StatorGroupState } from "@pestras/frontend/util/stator";
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
    super('dashboards', 'serial', 'topic', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _loadGroup(scope: string): Observable<Dashboard[]> {
    return this.service.getByScope({ topic: scope });
  }

  protected override _loadSingle(serial: string) {
    return this.service.getBySerial({ serial });
  }

  create(topic: string, title: string) {
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
              size: data.size,
              mode: data.mode
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

  // access
  // ---------------------------------------------------------------------------------------------------
  // orgunits
  addAccessOrgunit(serial: string, orgunit: string) {
    return this.service.addAccessOrgunit({ serial, orgunit })
      .pipe(tap(() => this._update(serial, t => {
        return { ...t, access: { ...t.access, orgunits: t.access.orgunits.concat(orgunit) } };
      })));
  }

  removeAccessOrgunit(serial: string, orgunit: string) {
    return this.service.removeAccessOrgunit({ serial, orgunit })
      .pipe(tap(() => this._update(serial, t => {
        return { ...t, access: { ...t.access, orgunits: t.access.orgunits.filter(g => g !== orgunit) } };
      })));
  }

  // users
  addAccessUser(serial: string, user: string) {
    return this.service.addAccessUser({ serial, user })
      .pipe(tap(() => this._update(serial, t => {
        return { ...t, access: { ...t.access, users: t.access.users.concat(user) } };
      })));
  }

  removeAccessUser(serial: string, user: string) {
    return this.service.removeAccessUser({ serial, user })
      .pipe(tap(() => this._update(serial, t => {
        return { ...t, access: { ...t.access, users: t.access.users.filter(g => g !== user) } };
      })));
  }

  // groups
  addAccessGroup(serial: string, group: string) {
    return this.service.addAccessGroup({ serial, group })
      .pipe(tap(() => this._update(serial, t => {
        return { ...t, access: { ...t.access, groups: t.access.groups.concat(group) } };
      })));
  }

  removeAccessGroup(serial: string, group: string) {
    return this.service.removeAccessGroup({ serial, group })
      .pipe(tap(() => this._update(serial, t => {
        return { ...t, access: { ...t.access, groups: t.access.groups.filter(g => g !== group) } };
      })));
  }
}