import { Injectable } from "@angular/core";
import { StatorChannel, StatorCollectionState } from "@pestras/frontend/util/stator";
import { Notification } from "@pestras/shared/data-model";
import { NotificationsService } from "./notifications.service";
import { Observable, tap } from "rxjs";
import { SessionEnd, SessionStart } from "../session/session.events";

@Injectable()
export class NotificationsState extends StatorCollectionState<Notification> {

  constructor(
    private service: NotificationsService,
    private channel: StatorChannel
  ) {
    super('notifications', 'serial', ['1m'], true);

    this.channel.select(SessionStart)
      .pipe(tap(() => this._init()))
      .subscribe(() => this._setLoading(false));

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _load(): Observable<Notification<null>[]> {
    return this.service.getUnSeen();
  }

  setSeen(serial: string) {
    return this.service.setSeen({ serial })
      .pipe(tap(() => this._update(serial, { seen_date: new Date() })));
  }
}