/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity, EntityTypes } from "@pestras/shared/data-model";
import { SSEActivity } from "../sse/sse.events";
import { SessionEnd } from "../session/session.events";
import { ClientApiState } from "./client-api.state";
import { filter } from 'rxjs';

export function clientApiListeners(this: ClientApiState) {

  // when session ends clear state
  this.channel.select(SessionEnd)
    .subscribe(() => this._clear());

  // sse events
  this.channel.select(SSEActivity)
    .pipe(filter(act => act.entity === EntityTypes.CLIENT_API))
    .subscribe(act => sseHandlers[act.method].call(this, act));
}

const sseHandlers: Record<string, (this: ClientApiState, activity: Activity<any>) => void> = {
  // new api
  create(this: ClientApiState, act: Activity<any>) {
    this.service.getBySerial({ serial: act.serial })
      .subscribe(c => !!c && this._insert(c));
  },

  // data store added
  addDataStore(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, c => ({ ...c, data_stores: [...c.data_stores, act.payload['data_store']] }));
  },
  // data store updated
  updateDataStore(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, c => ({
      ...c, data_stores: c.data_stores.map(d => {
        if (d.serial !== act.payload['serial'])
          return d;

        return { ...d, ...act.payload['change'] };
      })
    }));
  },
  // data store removed
  removeDataStore(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, c => ({ ...c, data_stores: c.data_stores.filter(d => d.serial !== act.payload['data_store']) }));
  },

  // api deleted
  delete(this: ClientApiState, act: Activity<any>) {
    this._delete(act.serial);
  },

  // ip added
  addIP(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, c => ({ ...c, ips: [...c.ips, act.payload['ip']] }));
  },
  // ip removed
  removeIP(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, c => ({ ...c, ips: c.ips.filter(i => i !== act.payload['ip']) }));
  },

  // param added
  addParam(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, ca => {
      return {
        ...ca,
        last_modified: act.create_date,
        data_stores: ca.data_stores.map(d => d.serial !== act.payload['data_store']
          ? d
          : { ...d, params: [...d.params, act.payload['param']] }
        )
      };
    });
  },
  // param updated
  updateParam(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, ca => {
      return {
        ...ca,
        last_modified: act.create_date,
        data_stores: ca.data_stores.map(d => d.serial !== act.payload['data_store']
          ? d
          : { ...d, params: d.params.map(p => p.serial !== act.payload['param'] ? p : { ...p, ...act.payload['change'] }) }
        )
      };
    });
  },
  // param deleted
  deleteParam(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, ca => {
      return {
        ...ca,
        last_modified: act.create_date,
        data_stores: ca.data_stores.map(d => d.serial !== act.payload['data_store']
          ? d
          : { ...d, params: d.params.filter(p => p.serial !== act.payload['param']) }
        )
      };
    });
  },

  // client updated
  update(this: ClientApiState, act: Activity<any>) {
    this._update(act.serial, { client_name: act.payload['client_name'] });
  }
};