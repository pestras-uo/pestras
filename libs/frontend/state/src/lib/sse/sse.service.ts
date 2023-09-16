/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { StatorChannel } from '@pestras/frontend/util/stator';
import { SessionEnd, SessionStart } from '../session/session.events';
import { Activity } from '@pestras/shared/data-model';
import { SSEActivity } from './sse.events';
import { EnvService } from '@pestras/frontend/env';
import { SessionState } from '../session/session.state';

@Injectable()
export class SSEService {
  private es: EventSource | null = null;
  private reconnect = false;

  constructor(
    private envServ: EnvService,
    private session: SessionState,
    private channel: StatorChannel
  ) {
    this.channel.select(SessionStart)
      .subscribe(() => this.init());

    this.channel.select(SessionEnd)
      .subscribe(() => this.end());
  }

  protected init() {
    this.reconnect = true;
    this.es = new EventSource(this.envServ.env.api + '/events/' + this.session.getSSEToken());

    this.es.addEventListener('activity', (e: MessageEvent<string>) => {
      try {
        const data: Activity<any> = JSON.parse(e.data);
        this.channel.dispatch(new SSEActivity(data));

      } catch (e: any) {
        console.error('error parsing sse event data:');
        console.error(e.data);
      }
    });

    this.es.addEventListener('error', e => {
      console.warn(e.type);
      if (this.reconnect)
        setTimeout(() => this.reconnect && this.init(), 5000);
    });
  }

  protected end() {
    this.reconnect = false;
    if (this.es) {
      this.es.close();
      this.es = null;
    }
  }
}
