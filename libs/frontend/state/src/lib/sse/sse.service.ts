/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@angular/core';
import { StatorChannel } from '@pestras/frontend/util/stator';
import { SessionEnd, SessionStart } from '../session/session.events';
import { Activity } from '@pestras/shared/data-model';
import { SSEActivity } from './sse.events';
import { STATE_CONFIG, StateConfig } from '../config';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  private es: EventSource | null = null;

  constructor(
    @Inject(STATE_CONFIG) private config: StateConfig,
    private channel: StatorChannel
  ) {
    this.channel.select(SessionStart)
      .subscribe(() => this.init());

    this.channel.select(SessionEnd)
      .subscribe(() => this.end());
  }

  protected init() {
    this.es = new EventSource(this.config.api + '/events', { withCredentials: true });

    this.es.addEventListener('activity', (e: MessageEvent<string>) => {
      console.log('sse:');
      try {
        const data: Activity<any> = JSON.parse(e.data);
        this.channel.dispatch(new SSEActivity(data));

      } catch (e: any) {
        console.error('error parsing sse event data:');
        console.error(e.data);
      }
    });
  }

  protected end() {
    if (this.es) {
      this.es.close();
      this.es = null;
    }
  }
}
