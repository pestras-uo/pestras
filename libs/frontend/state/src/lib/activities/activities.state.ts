/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@angular/core";
import { StatorChannel, StatorQueryState } from "@pestras/frontend/util/stator";
import { ActivityStats } from "./activities.api";
import { ActivitiesService } from "./activities.service";
import { SessionEnd } from "../session/session.events";
import { Observable, of } from "rxjs";

export { ActivityStats };

@Injectable()
export class ActivitiesState extends StatorQueryState<ActivityStats> {

  constructor(
    private service: ActivitiesService,
    private channel: StatorChannel
  ) {
    super('activities', 'user', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetchDoc(id: string): Observable<ActivityStats | null> {
    const [serial, period] = id.split('-');

    return period === 'week'
      ? this.service.getLastWeek({ serial })
      : period === 'month'
        ? this.service.getLastMonth({ serial })
        : period === 'year'
          ? this.service.getLastYear({ serial })
          : of(null);
  }
}