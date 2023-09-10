import { Injectable } from '@angular/core';
import { Topic } from '@pestras/shared/data-model';
import { tap } from 'rxjs';
import { StatorChannel, StatorGroupState } from '@pestras/frontend/util/stator';
import { TopicsService } from './topics.service';
import { TopicsApi } from './topics.api';
import { topicsListeners } from './topics.listeners';

@Injectable({ providedIn: 'root' })
export class TopicsState extends StatorGroupState<Topic> {

  constructor(
    protected service: TopicsService,
    protected channel: StatorChannel
  ) {
    super('bp-instances', 'serial', 'parent', ['1h']);

    topicsListeners.call(this);
  }

  protected override _fetchGroup(parent: string | null) {
    return this.service.getByParent({ parent });
  }

  protected override _fetch(serial: string) {
    return this.service.getBySerial({ serial });
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