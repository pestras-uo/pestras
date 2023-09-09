import { Injectable } from '@angular/core';
import { Report } from "@pestras/shared/data-model";
import { StatorChannel, StatorQueryState } from "@pestras/frontend/util/stator";
import { ReportsService } from './reports.service';
import { SessionEnd } from '../session/session.events';
import { ReportsApi } from './reports.api';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsState extends StatorQueryState<Report> {

  constructor(
    private readonly service: ReportsService,
    private readonly channel: StatorChannel
  ) {
    super('reports', 'serial', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetchQuery(topic: string) {
    return this.service.getByScope({ topic }).pipe(map(res => ({ count: res.length, results: res })));
  }

  protected override _fetchDoc(serial: string) {
    return this.service.getBySerial({ serial });
  }

  protected override _onChange(doc: Report): void {
    this._updateInQuery(doc.topic, doc);
  }

  protected override _onRemove(doc: Report): void {
    this._removeFromQuery(doc.topic, doc.serial);
  }

  selectGroup(topic: string) {
    return this.query(topic).pipe(map(res => res.results));
  }

  // create
  // ------------------------------------------------------------------------------
  create(topic: string, title: string) {
    return this.service.create({ topic, title })
      .pipe(tap(res => this._insert(res)));
  }

  // update
  // ------------------------------------------------------------------------------
  update(serial: string, title: string) {
    return this.service.update({ serial }, { title })
      .pipe(tap(res => this._update(serial, { title, last_modified: new Date(res) })));
  }

  // slides
  // -----------------------------------------------------------------------------------------
  addSlide(serial: string, data: ReportsApi.AddSlide.Body) {
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

  updateSlide(serial: string, slide: string, data: ReportsApi.UpdateSlide.Body) {
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
  addView(serial: string, data: ReportsApi.AddView.Body) {
    return this.service.addView({ serial }, data)
      .pipe(
        tap(res => this._update(serial, d => {
          return {
            ...d,
            last_modified: new Date(res.date),
            views: d.views.concat(res.view),
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

  updateViewContent(serial: string, view: string, content: string) {
    return this.service.updateViewContent({ serial, view }, { content })
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res),
          views: d.views.map(v => {
            if (v.serial !== view)
              return v;

            return {
              ...v,
              content: content
            };
          })
        }
      })));
  }

  updateViewImage(serial: string, view: string, image: File) {
    return this.service.updateViewImage({ serial, view }, { image })
      .pipe(tap(res => this._update(serial, d => {
        return {
          ...d,
          last_modified: new Date(res.date),
          views: d.views.map(v => {
            if (v.serial !== view)
              return v;

            return {
              ...v,
              content: res.path
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

  updateView(serial: string, view: string, data: ReportsApi.UpdateView.Body) {
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
              title: data.title,
              sub_title: data.sub_title
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