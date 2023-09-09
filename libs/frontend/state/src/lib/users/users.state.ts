import { Injectable } from '@angular/core';
import { EntityTypes, Role, User } from '@pestras/shared/data-model';
import { StatorChannel, StatorCollectionState } from '@pestras/frontend/util/stator';
import { SessionChange, SessionEnd, SessionStart } from '../session/session.events';
import { UsersService } from './users.service';
import { Observable, tap, filter } from 'rxjs';
import { UsersApi } from './users.api';
import { SSEActivity } from '../sse/sse.events';

@Injectable()
export class UsersState extends StatorCollectionState<User> {

  constructor(
    private service: UsersService,
    private channel: StatorChannel
  ) {
    super('users', 'serial', ['1h'], true);

    this.initListeners();
  }

  private initListeners() {
    // when session starts fetch all users
    this.channel.select(SessionStart)
      .pipe(tap(() => this._init()))
      .subscribe(() => this._setLoading(false));

    // when session ends clear state
    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());

    // when session profile, username or avater changes update user
    this.channel.select(SessionChange)
      .subscribe(session => {
        const user = this.get(session.serial);

        if (user)
          this._upsert(user, 'replace');
      });

    // sse events
    this.channel.select(SSEActivity)
      .pipe(filter(act => act.entity === EntityTypes.USER))
      .subscribe(act => {
        // new user
        if (act.method === 'create')
          this.service.getBySerial({ serial: act.serial })
            .subscribe(u => !!u && this._insert(u));

        // user added to group
        else if (act.method === 'addGroup')
          this._update(act.serial, u => ({ ...u, groups: [...u.groups, act.payload['group']] }));

        // user removed from group
        else if (act.method === 'removeGroup')
          this._update(act.serial, u => ({ ...u, groups: u.groups.filter(g => g !== act.payload['group']) }));

        // user roles updated
        else if (act.method === 'updateRoles')
          this._update(act.serial, { ...act.payload, last_modified: new Date() });
      });
  }

  protected override _load(): Observable<User[]> {
    return this.service.getAll();
  }

  // crud
  // ----------------------------------------------------------------------
  create(data: UsersApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(res => this._insert(res)));
  }

  updateRoles(serial: string, roles: Role[], is_super: boolean) {
    return this.service.updateRoles({ serial }, { roles, is_super })
      .pipe(tap(res => this._update(serial, u => ({
        ...u,
        roles,
        is_super,
        last_modified: new Date(res)
      }))));
  }

  addGroup(serial: string, group: string) {
    return this.service.addGroup({ serial, group })
      .pipe(tap(res => this._update(serial, u => ({
        ...u,
        groups: u.groups.concat(group),
        last_modified: new Date(res)
      }))));
  }

  removeGroup(serial: string, group: string) {
    return this.service.removeGroup({ serial, group })
      .pipe(tap(res => this._update(serial, u => ({
        ...u,
        groups: u.groups.filter(r => r !== group),
        last_modified: new Date(res)
      }))))
  }

  addAlternative(serial: string, alternative: string) {
    return this.service.addAlternative({ serial, alternative })
      .pipe(tap(res => this._update(serial, u => ({
        ...u,
        alternatives: u.alternatives.concat(alternative),
        last_modified: new Date(res)
      }))));
  }

  removeAlternative(serial: string, alternative: string) {
    return this.service.removeAlternative({ serial, alternative })
      .pipe(tap(res => this._update(serial, u => ({
        ...u,
        alternatives: u.alternatives.filter(r => r !== alternative),
        last_modified: new Date(res)
      }))))
  }
}