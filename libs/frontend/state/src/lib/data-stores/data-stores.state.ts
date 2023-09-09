/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { DataStore, DataStoreState, WebServiceConfig, createField } from "@pestras/shared/data-model";
import { StatorChannel, StatorQueryState } from "@pestras/frontend/util/stator";
import { DataStoresService } from "./data-stores.service";
import { DataStoresApi } from "./data-stores.api";
import { tap, map, of } from "rxjs";
import { dataStoresListeners } from "./data-stores.listeners";

@Injectable({ providedIn: 'root' })
export class DataStoresState extends StatorQueryState<DataStore> {

  constructor(
    protected service: DataStoresService,
    protected channel: StatorChannel
  ) {
    super('datastores', 'serial', ['1h']);

    dataStoresListeners.call(this);
  }

  protected override _fetchQuery(bp: string) {
    return (bp
      ? this.service.getByBlueprint({ bp })
      : of([])).pipe(map(res => ({ count: res.length, results: res })));
  }

  protected override _fetchDoc(serial: string) {
    return this.service.getBySerial({ serial });
  }

  protected override _onChange(doc: DataStore): void {
    this._updateInQuery(doc.blueprint, doc);
  }

  protected override _onRemove(doc: DataStore): void {
    this._removeFromQuery(doc.blueprint, doc.serial);
  }

  selectGroup(bp: string) {
    return this.query(bp).pipe(map(res => res.results));
  }

  create(data: DataStoresApi.Create.Body) {
    return this.service.create(data)
      .pipe(tap(ds => this._insert(ds)));
  }

  update(serial: string, name: string) {
    return this.service.update({ serial }, { name })
      .pipe(tap(date => this._update(serial, { name, last_modified: new Date(date) })));
  }

  build(serial: string) {
    return this.service.build({ serial })
      .pipe(tap(date => this._update(serial, { state: DataStoreState.READY, last_modified: new Date(date) })));
  }


  // table
  // --------------------------------------------------------------------------------------
  setTableSettings(serial: string, data: DataStoresApi.SetTableSettings.Body) {
    return this.service.setTableSettings({ serial }, data)
      .pipe(tap(date => this._update(serial, { settings: data, last_modified: new Date(date) })));
  }


  // web service
  // --------------------------------------------------------------------------------------
  setWebServiceSettings(serial: string, data: DataStoresApi.SetWebServiceSettings.Body) {
    return this.service.setWebServiceSettings({ serial }, data)
      .pipe(tap(date => this._update(serial, { web_service: data as WebServiceConfig, last_modified: new Date(date) }, 'deepMerge')));
  }

  setWebServiceAuth(serial: string, data: DataStoresApi.SetWebServiceAuth.Body) {
    return this.service.setWebServiceAuth({ serial }, data)
      .pipe(tap(date => this._update(serial, { web_service: { auth: data } as WebServiceConfig, last_modified: new Date(date) }, 'deepMerge')));
  }

  removeWebServiceAuth(serial: string) {
    return this.service.removeWebServiceAuth({ serial })
      .pipe(tap(date => this._update(serial, { web_service: { auth: null } as WebServiceConfig, last_modified: new Date(date) }, 'deepMerge')));
  }

  setWebServiceHeader(serial: string, data: DataStoresApi.SetWebServiceHeader.Body) {
    return this.service.setWebServiceHeader({ serial }, data)
      .pipe(tap(date => this._update(serial, ds => {

        if (!ds.web_service)
          return ds;

        const newHeaders = [...ds.web_service.headers];
        const header = newHeaders.find(h => h.key === data.key);

        if (header)
          header.value = data.value;
        else
          newHeaders.push(data);

        return {
          ...ds,
          web_service: { ...ds.web_service, headers: newHeaders },
          last_modified: new Date(date)
        }
      })));
  }

  removeWebServiceHeader(serial: string, key: string) {
    return this.service.removeWebServiceHeader({ serial, key })
      .pipe(tap(date => this._update(serial, ds => {

        if (!ds.web_service)
          return ds;

        return {
          ...ds,
          web_service: { ...ds.web_service, headers: ds.web_service.headers.filter((h: any) => h.key !== key) },
          last_modified: new Date(date)
        }
      })));
  }

  addWebServiceParam(serial: string, data: DataStoresApi.AddWebServiceQuery.Body) {
    return this.service.addWebServiceQuery({ serial }, data)
      .pipe(tap(res => this._update(serial, ds => {

        if (!ds.web_service)
          return ds;

        return {
          ...ds,
          last_modified: new Date(res.date),
          web_service: { ...ds.web_service, payload: ds.web_service.payload.concat(res.option) }
        }
      })));
  }

  removeWebServiceParam(serial: string, option: string) {
    return this.service.removeWebServiceQuery({ serial, option })
      .pipe(tap(date => this._update(serial, ds => {

        if (!ds.web_service)
          return ds;

        return {
          ...ds,
          web_service: { ...ds.web_service, payload: ds.web_service.payload.filter((h: any) => h.serial !== option) },
          last_modified: new Date(date)
        }
      })));
  }

  addWebServiceSelection(serial: string, data: DataStoresApi.AddWebServiceSelection.Body) {
    return this.service.addWebServiceSelection({ serial }, data)
      .pipe(tap(ds => this._update(serial, {
        fields: ds.fields,
        web_service: ds.web_service,
        last_modified: new Date(ds.last_modified)
      })));
  }

  removeWebServiceSelection(serial: string, field: string) {
    return this.service.removeWebServiceSelection({ serial, field })
      .pipe(tap(ds => this._update(serial, {
        fields: ds.fields,
        web_service: ds.web_service,
        last_modified: new Date(ds.last_modified)
      })));
  }


  // aggregation
  // --------------------------------------------------------------------------------------
  setAggregationSettings(serial: string, data: DataStoresApi.SetAggregationSettings.Body) {
    return this.service.setAggregationSettings({ serial }, data)
      .pipe(tap(ds => this._update(serial, {
        fields: ds.fields,
        aggr: ds.aggr,
        last_modified: new Date(ds.last_modified)
      })));
  }


  // fields
  // --------------------------------------------------------------------------------------
  addField(serial: string, data: DataStoresApi.AddField.Body) {
    return this.service.addField({ serial }, data)
      .pipe(
        tap(date => this._update(serial, ds => {
          return {
            ...ds,
            fields: ds.fields.concat(createField(data)),
            last_modified: new Date(date)
          }
        })),
        map(() => this.get(serial)?.fields.find(f => f.name === data.name) ?? null)
      );
  }

  updateField(serial: string, field: string, data: DataStoresApi.UpdateField.Body) {
    return this.service.updateField({ serial, field }, data)
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          fields: ds.fields.map(f => f.name === field ? { ...f, ...data } : f),
          last_modified: new Date(date)
        }
      })));
  }

  updateFieldConfig(serial: string, field: string, data: DataStoresApi.UpdateFieldConfig.Body) {
    return this.service.updateFieldConfig({ serial, field }, data)
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          fields: ds.fields.map(f => f.name === field ? { ...f, ...data } : f),
          last_modified: new Date(date)
        }
      })));
  }

  setFieldConstraint(serial: string, field: string, data: DataStoresApi.SetFieldConstraint.Body) {
    return this.service.setFieldConstraint({ serial, field }, data)
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          fields: ds.fields.map(f => f.name === field ? { ...f, constraint: data } : f),
          last_modified: new Date(date)
        }
      })));
  }

  removeFieldConstraint(serial: string, field: string) {
    return this.service.removeFieldConstraint({ serial, field })
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          fields: ds.fields.map(f => f.name === field ? { ...f, constraint: null } : f),
          last_modified: new Date(date)
        }
      })));
  }

  removeField(serial: string, field: string) {
    return this.service.removeField({ serial, field })
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          fields: ds.fields.filter(f => f.name !== field),
          last_modified: new Date(date)
        }
      })));
  }


  // owner & collaborators
  // --------------------------------------------------------------------------------------
  addCollaborator(serial: string, collaborator: string) {
    return this.service.addCollaborator({ serial, collaborator })
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          collaborators: ds.collaborators.concat(collaborator),
          last_modified: new Date(date)
        }
      })));
  }

  removeCollaborator(serial: string, collaborator: string) {
    return this.service.removeCollaborator({ serial, collaborator })
      .pipe(tap(date => this._update(serial, ds => {
        return {
          ...ds,
          collaborators: ds.collaborators.filter(c => c !== collaborator),
          last_modified: new Date(date)
        }
      })));
  }


  // activation
  // --------------------------------------------------------------------------------------
  setActivation(serial: string, is_active: boolean) {
    return this.service.setActivation({ serial, is_active: is_active ? "1" : "" })
      .pipe(tap(date => this._update(serial, { is_active, last_modified: new Date(date) })));
  }
}