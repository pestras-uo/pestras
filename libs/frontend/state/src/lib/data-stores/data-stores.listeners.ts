/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataStoresState } from "./data-stores.state";
import { SessionEnd, SessionStart } from "../session/session.events";
import { SSEActivity } from "../sse/sse.events";
import { filter } from "rxjs";
import { Activity, EntityTypes, createField } from "@pestras/shared/data-model";

export function dataStoresListeners(this: DataStoresState) {
  // when session starts init cache
  this.channel.select(SessionStart)
    .subscribe(() => this._init());

  // when session ends clear state
  this.channel.select(SessionEnd)
    .subscribe(() => this._clear());

  // sse events
  this.channel.select(SSEActivity)
    .pipe(filter(act => act.entity === EntityTypes.DATA_STORE))
    .subscribe(act => sseHandlers[act.method].call(this, act));
}


const sseHandlers: Record<string, (this: DataStoresState, activity: Activity<any>) => void> = {
  // Create
  // -------------------------------------------------------------------------------------------------------------------------------
  // new data store
  create(this: DataStoresState, act: Activity<any>) {
    this.service.getBySerial({ serial: act.serial })
      .subscribe(ds => !!ds && this._insert(ds));
  },



  // Update
  // -------------------------------------------------------------------------------------------------------------------------------
  // data store updated
  update(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, act.payload);
  },

  // Activation
  // -------------------------------------------------------------------------------------------------------------------------------
  // toggle activation
  setActivation(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, { is_active: act.payload['is_active'] });
  },

  // Aggregation
  // -------------------------------------------------------------------------------------------------------------------------------
  // aggr updated
  setAggregation(this: DataStoresState, act: Activity<any>) {
    this.service.getBySerial({ serial: act.serial })
      .subscribe(ds => !!ds && this._upsert(ds));
  },

  // State
  // -------------------------------------------------------------------------------------------------------------------------------
  // state updated
  updateState(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, act.payload);
  },

  // Collaborators
  // -------------------------------------------------------------------------------------------------------------------------------
  // collaborator added
  addCollaborator(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => ({ ...ds, collaborators: [...ds.collaborators, act.payload['collaborator']] }));
  },
  // collaborator removed
  removeCollaborator(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => ({ ...ds, collaborators: ds.collaborators.filter(c => c !== act.payload['collaborator']) }));
  },

  // Fields
  // -------------------------------------------------------------------------------------------------------------------------------
  // new Field
  addField(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => {
      return {
        ...ds,
        fields: [...ds.fields, createField(act.payload['field'])],
        last_modified: act.create_date
      }
    });
  },
  // field updated
  updateField(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => {
      return {
        ...ds,
        fields: ds.fields.map(f => f.name === act.payload['field'] ? { ...f, ...act.payload['change'] } : f),
        last_modified: act.create_date
      }
    });
  },
  // field config updated
  updateFieldConfig(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => {
      return {
        ...ds,
        fields: ds.fields.map(f => f.name === act.payload['field'] ? { ...f, ...act.payload['change'] } : f),
        last_modified: act.create_date
      }
    });
  },
  // field constraints updated
  setFieldConstraint(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => {
      return {
        ...ds,
        fields: ds.fields.map(f => f.name === act.payload['field'] ? { ...f, constraint: act.payload['change'] } : f),
        last_modified: act.create_date
      }
    });
  },
  // field removed
  removeField(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => {
      return {
        ...ds,
        fields: ds.fields.filter(f => f.name !== act.payload['field']),
        last_modified: act.create_date
      }
    });
  },

  // Settings
  // -------------------------------------------------------------------------------------------------------------------------------
  // settings updated
  setTableSettings(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, { settings: act.payload, last_modified: act.create_date });
  },

  // Web Service
  // -------------------------------------------------------------------------------------------------------------------------------
  // set main web service config
  setWebServiceConfig(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, { web_service: act.payload, last_modified: act.create_date }, 'deepMerge');
  },
  // set web service auth
  setWebServiceAuth(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, { web_service: act.payload, last_modified: act.create_date }, 'deepMerge');
  },
  // set web service header
  setHeader(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => !ds.web_service
      ? ds
      : {
        ...ds,
        last_modified: act.create_date,
        web_service: {
          ...ds.web_service,
          headers: act.payload['header']?.value
            ? [...ds.web_service.headers, act.payload['header']]
            : ds.web_service.headers.filter((h: any) => h.key !== act.payload['header'].key)
        }
      }
    );
  },
  // param added
  addQueryOption(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => !ds.web_service
      ? ds
      : {
        ...ds,
        last_modified: act.create_date,
        web_service: { ...ds.web_service, payload: [...ds.web_service.payload, act.payload['param']] }
      }
    )
  },
  // param removed
  removeQueryOption(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, ds => !ds.web_service
      ? ds
      : {
        ...ds,
        web_service: { ...ds.web_service, payload: ds.web_service.payload.filter((h: any) => h.serial !== act.payload['param']) },
        last_modified: act.create_date
      }
    )
  },
  // selection added
  addSelection(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, { web_service: act.payload, last_modified: act.create_date }, 'deepMerge');
  },
  // selection removed
  removeSelection(this: DataStoresState, act: Activity<any>) {
    this._update(act.serial, { web_service: act.payload, last_modified: act.create_date }, 'deepMerge');
  }
}