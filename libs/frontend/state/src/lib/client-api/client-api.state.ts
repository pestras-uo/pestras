import { Injectable } from "@angular/core";
import { ClientApi } from "@pestras/shared/data-model";
import { Observable, tap } from "rxjs";
import { StatorChannel, StatorGroupState } from "@pestras/frontend/util/stator";
import { ClientApiService } from "./client-api.service";
import { ClientApiApi } from "./client-api.api";
import { clientApiListeners } from "./client-api.listeners";

@Injectable({ providedIn: 'root' })
export class ClientApiState extends StatorGroupState<ClientApi> {

  constructor(
    protected service: ClientApiService,
    protected channel: StatorChannel
  ) {
    super('client-api', 'serial', 'blueprint', ['1h']);

    clientApiListeners.call(this);
  }

  protected override _fetchGroup(blueprint: string): Observable<ClientApi[]> {
    return this.service.getByBlueprint({ blueprint });
  }

  protected override _fetch(serial: string): Observable<ClientApi | null> {
    return this.service.getBySerial({ serial });
  }


  create(blueprint: string, client_name: string) {
    return this.service.create({ blueprint, client_name })
      .pipe(tap(ca => this._insert(ca)));
  }



  update(serial: string, client_name: string) {
    return this.service.update({ serial }, { client_name })
      .pipe(tap(date => this._update(serial, { last_modified: new Date(date), client_name })));
  }




  addIP(serial: string, ip: string) {
    return this.service.addIP({ serial }, { ip })
      .pipe(tap(date => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(date),
          ips: ca.ips.concat(ip)
        };
      })));
  }

  removeIP(serial: string, ip: string) {
    return this.service.removeIP({ serial }, { ip })
      .pipe(tap(date => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(date),
          ips: ca.ips.filter(p => p !== ip)
        };
      })));
  }




  addDataStore(serial: string, ds: string, data: ClientApiApi.AddDataStore.Body) {
    return this.service.addDataStore({ serial, ds }, data)
      .pipe(tap(date => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(date),
          data_stores: ca.data_stores.concat({
            ...data,
            serial: ds,
            params: []
          })
        };
      })));
  }

  updateDataStore(serial: string, ds: string, data: ClientApiApi.AddDataStore.Body) {
    return this.service.updateDataStore({ serial, ds }, data)
      .pipe(tap(date => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(date),
          data_stores: ca.data_stores.map(d => d.serial === ds
            ? { ...d, ...data }
            : d
          )
        };
      })));
  }

  removeDataStore(serial: string, ds: string) {
    return this.service.removeDataStore({ serial, ds })
      .pipe(tap(date => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(date),
          data_stores: ca.data_stores.filter(d => d.serial !== serial)
        };
      })));
  }




  addParam(serial: string, ds: string, data: ClientApiApi.AddParam.Body) {
    return this.service.addParam({ serial, ds }, data)
      .pipe(tap(res => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(res.date),
          data_stores: ca.data_stores.map(d => d.serial !== ds
            ? d
            : { ...d, params: d.params.concat(res.param) }
          )
        };
      })));
  }

  updateParam(serial: string, ds: string, param: string, data: ClientApiApi.UpdateParam.Body) {
    return this.service.updateParam({ serial, ds, param }, data)
      .pipe(tap(date => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(date),
          data_stores: ca.data_stores.map(d => d.serial !== ds
            ? d
            : { ...d, params: d.params.map(p => p.serial !== param ? p : { ...p, ...data }) }
          )
        };
      })));
  }

  removeParam(serial: string, ds: string, param: string) {
    return this.service.removeParam({ serial, ds, param })
      .pipe(tap(date => this._update(serial, ca => {
        return {
          ...ca,
          last_modified: new Date(date),
          data_stores: ca.data_stores.map(d => d.serial !== ds
            ? d
            : { ...d, params: d.params.filter(p => p.serial !== param) }
          )
        };
      })));
  }



  delete(serial: string) {
    return this.service.delete({ serial })
      .pipe(tap(() => this._delete(serial)));
  }
}