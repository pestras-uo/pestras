import { Injectable } from "@angular/core";
import { StatorChannel, StatorEntitiesState } from "@pestras/frontend/util/stator";
import { EntityAccess } from "@pestras/shared/data-model";
import { EntityAccessService } from "./entity-access.service";
import { SessionEnd } from "../session/session.events";
import { Observable, tap } from "rxjs";

@Injectable()
export class EntityAccessState extends StatorEntitiesState<EntityAccess> {

  constructor(
    private service: EntityAccessService,
    private channel: StatorChannel
  ) {
    super('entity-access', 'entity', ['10m']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());

  }

  protected override _fetch(entity: string): Observable<EntityAccess | null> {
    return this.service.getByEntity({ entity });
  }

  allowGuests(entity: string, allow: boolean) {
    return this.service.allowGuests({ entity }, { allow })
      .pipe(tap(() => this._update(entity, { allow_guests: allow })));
  }

  addOrgunit(entity: string, orgunit: string) {
    return this.service.addOrgunit({ entity, orgunit })
      .pipe(tap(() => this._update(entity, t => {
        return { ...t, orgunits: t.orgunits.concat(orgunit) } ;
      })));
  }

  removeOrgunit(entity: string, orgunit: string) {
    return this.service.removeOrgunit({ entity, orgunit })
      .pipe(tap(() => this._update(entity, t => {
        return { ...t, orgunits: t.orgunits.filter(g => g !== orgunit) } ;
      })));
  }

  // users
  addUser(entity: string, user: string) {
    return this.service.addUser({ entity, user })
      .pipe(tap(() => this._update(entity, t => {
        return { ...t, users: t.users.concat(user) };
      })));
  }

  removeUser(entity: string, user: string) {
    return this.service.removeUser({ entity, user })
      .pipe(tap(() => this._update(entity, t => {
        return { ...t, users: t.users.filter(g => g !== user) };
      })));
  }

  // groups
  addGroup(entity: string, group: string) {
    return this.service.addGroup({ entity, group })
      .pipe(tap(() => this._update(entity, t => {
        return { ...t, groups: t.groups.concat(group) };
      })));
  }

  removeGroup(entity: string, group: string) {
    return this.service.removeGroup({ entity, group })
      .pipe(tap(() => this._update(entity, t => {
        return { ...t, groups: t.groups.filter(g => g !== group) };
      })));
  }
}