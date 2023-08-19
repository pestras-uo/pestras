/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { StatorChannel } from '@pestras/frontend/util/stator';
import { SessionEnd, SessionStart } from '../session/session.events';
import { Activity } from '@pestras/shared/data-model';
import { SSEActivity } from './sse.events';
import { EnvService } from '@pestras/frontend/env';

@Injectable()
export class SSEService {
  private es: EventSource | null = null;

  constructor(
    private envServ: EnvService,
    private channel: StatorChannel
  ) {
    this.channel.select(SessionStart)
      .subscribe(() => this.init());

    this.channel.select(SessionEnd)
      .subscribe(() => this.end());
  }

  protected init() {
    this.es = new EventSource(this.envServ.env.api + '/events', { withCredentials: true });

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
