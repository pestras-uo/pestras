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
}