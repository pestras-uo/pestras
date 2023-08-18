import { Injectable } from "@angular/core"
import { EntityTypes, UsersGroup } from "@pestras/shared/data-model";
import { StatorChannel, StatorCollectionState } from "@pestras/frontend/util/stator";
import { UsersGroupsService } from "./users-groups.service";
import { SessionEnd, SessionStart } from "../session/session.events";
import { tap, filter } from 'rxjs';
import { SSEActivity } from "../sse/sse.events";

@Injectable({ providedIn: 'root' })
export class UsersGroupsState extends StatorCollectionState<UsersGroup> {

  constructor(
    private service: UsersGroupsService,
    private channel: StatorChannel
  ) {
    super('users-categories', 'serial', ['1h'], true);

    this.initListeners();
  }

  private initListeners() {

    // when session starts fetch all groups
    this.channel.select(SessionStart)
      .pipe(tap(() => this._init()))
      .subscribe(() => this._setLoading(false));

    // when session ends clear state
    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());

    // sse group events
    this.channel.select(SSEActivity)
      .pipe(filter(act => act.entity === EntityTypes.GROUP))
      .subscribe(act => {
        if (act.method === 'create')
          this.service.getBySerial({ serial: act.serial })
            .subscribe(g => !!g && this._insert(g));

        else if (act.method === 'update')
          this._update(act.serial, { name: act.payload.name });

        else if (act.method === 'delete')
          this._delete(act.serial);
      });

  }

  protected override _load() {
    return this.service.getAll();
  }

  create(name: string) {
    return this.service.create({ name })
      .pipe(tap(g => this._insert(g)));
  }

  update(serial: string, name: string) {
    return this.service.update({ serial }, { name })
      .pipe(tap(date => this._update(serial, { name, last_modified: new Date(date) })));
  }

  delete(serial: string) {
    return this.service.delete({ serial })
      .pipe(tap(() => this._delete(serial)));
  }
}