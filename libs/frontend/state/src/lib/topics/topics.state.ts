import { Injectable } from '@angular/core';
import { Topic } from '@pestras/shared/data-model';
import { map, tap } from 'rxjs';
import { StatorChannel, StatorQueryState } from '@pestras/frontend/util/stator';
import { TopicsService } from './topics.service';
import { TopicsApi } from './topics.api';
import { topicsListeners } from './topics.listeners';

@Injectable({ providedIn: 'root' })
export class TopicsState extends StatorQueryState<Topic> {

  constructor(
    protected service: TopicsService,
    protected channel: StatorChannel
  ) {
    super('bp-instances', 'serial', ['1h']);

    topicsListeners.call(this);
  }

  protected override _fetchQuery(parent: string | null) {
    return this.service.getByParent({ parent }).pipe(map(res => ({ count: res.length, results: res })))
  }

  protected override _fetchDoc(serial: string) {
    return this.service.getBySerial({ serial });
  }

  protected override _onChange(doc: Topic): void {
    this._updateInQuery(doc.parent, doc);
  }

  protected override _onRemove(doc: Topic): void {
    this._removeFromQuery(doc.parent, doc.serial);
  }

  selectGroup(parent: string | null) {
    return this.query(parent).pipe(map(res => res.results));
  }

  create(data: TopicsApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(bpi => this._insert(bpi)));
  }

  update(serial: string, name: string) {
    return this.service.update({ serial }, { name })
      .pipe(tap(date => this._update(serial, { name, last_modified: new Date(date) })));
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