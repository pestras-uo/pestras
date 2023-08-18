/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';
import { Activity, EntityTypes, Role } from '@pestras/shared/data-model';

export interface EventScope {
  roles?: Role[];
  orgunits?: string[];
  users?: string[];
  groups?: string[];
}

class PubSub extends EventEmitter {

  emitActivity(data: Activity<any>, scope?: EventScope) {
    if (scope)
      this.emit('serverEvent', data, scope);
    return this.emit('activity', data);
  }

  on<T = any>(eventName: string | symbol, listener: (data: T, ...args: any[]) => void): this {
    return super.on(eventName, listener);
  }

  onActivity<T extends (Record<string, any> | null) = null>(cb: (activity: Activity<T>) => void): void;
  onActivity<T extends (Record<string, any> | null) = null>(query: Partial<Activity<T>>, cb: (activity: Activity<T>) => void): void;
  onActivity<T extends (Record<string, any> | null) = null>(entity: EntityTypes, cb: (activity: Activity<T>) => void): void;
  onActivity<T extends (Record<string, any> | null) = null>(entity: EntityTypes, methods: string[], cb: (activity: Activity<T>) => void): void;
  onActivity<T extends (Record<string, any> | null) = null>(
    entity: ((data: Activity<T>) => void) | EntityTypes | Partial<Activity<T>>,
    methods?: string[] | ((data: Activity<T>) => void),
    cb?: (activity: Activity<T>) => void
  ) {
    if (typeof entity === 'function')
      this.on<Activity<any>>('activity', entity);

    else if (typeof methods === "function") {
      if (typeof entity === 'object')
        this.on<Activity<T>>('activity', e => Object.keys(entity).every((k: any) => (entity as any)[k] === (e as any)[k]) && methods(e));
      else
        this.on<Activity<T>>('activity', e => e.entity === entity && methods(e));

    } else if (typeof cb === "function")
      this.on<Activity<T>>('activity', e => e.entity === entity && methods?.includes(e.method) && cb(e));

    else
      console.warn('invalid activity listener arguments!', entity, methods, cb);
  }

  onActivityMethod<T extends (Record<string, any> | null) = null>(method: string, cb: (data: Activity<T>) => void) {
    this.on<Activity<T>>('activity', e => e.method === method && cb(e));
  }

  onServerEvent(cb: (activity: Activity<any>, scope: EventScope) => void) {
    this.on('serverEvent', (a: Activity<any>, s: EventScope) => cb(a, s));
  }
}


const pubSub = new PubSub();

pubSub.setMaxListeners(100)

export class Core {
  protected pubSub = pubSub;
}