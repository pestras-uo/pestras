/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Subject, filter, merge } from "rxjs";
import { StatorConfig, STATOR_CONFIG } from "./types";

const events = new Map<string, EventState>;

interface EventState<T = any> {
  prev?: T,
  next: T,
  subject: BehaviorSubject<T>;
}

export abstract class StatorEvent<T = any> {
  static group: typeof StatorEvent[] = [];
  static meta = 'Unknown Event';

  constructor(readonly payload?: T) {}
}

@Injectable()
export class StatorChannel {

  constructor(@Inject(STATOR_CONFIG) private config: StatorConfig) { }

  private static getEvent<U, T extends StatorEvent<U> = StatorEvent<U>>(event: T | typeof StatorEvent<U>): EventState<U> | null {
    // extract event name
    const name = typeof event === 'function'
      ? event.name
      : event?.constructor?.name || null;

    if (name === null)
      return null;

    const e = events.get(name);

    if (!e) {
      events.set(name, { next: '@', subject: new BehaviorSubject<U>('@' as any) });
      return events.get(name) as EventState;
    }

    return e as EventState<U>;
  }

  dispatch<T extends StatorEvent<any>>(event: T) {

    const e = StatorChannel.getEvent(event);

    if (!e)
      return;

    e.prev = e.next;
    e.next = event.payload;

    if (this.config.development) {
      console.groupCollapsed('Event:', event.constructor.name, '-', (event.constructor as typeof StatorEvent).meta, 'dispatched:');
      console.log({ prev: e.prev });
      console.log({ next: e.next });
      console.groupEnd();
    }

    e.subject.next(event.payload);
  }

  select<T = any>(event: typeof StatorEvent<T>) {
    if (event.group.length > 0) {
      const group = event.group
        .map(evt => StatorChannel.getEvent<T>(evt))
        .filter(Boolean) as EventState<T>[];

      return merge(...group.map(e => e.subject.pipe(filter(v => v !== '@'))));
    }

    const e = StatorChannel.getEvent<T>(event);

    if (!e) {
      const s = new Subject<T>();
      s.complete();
      return s.asObservable();
    }

    return e.subject.pipe(filter(v => v !== '@'));
  }
}