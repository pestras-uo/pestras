/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { DataRecord, DataStore } from "@pestras/shared/data-model";
import { StatorChannel, StatorEntitiesState } from "@pestras/frontend/util/stator";
import { RecordsService } from "./records.service";
import { of, tap } from "rxjs";
import { SessionEnd } from "../session/session.events";


@Injectable({ providedIn: 'root' })
export class RecordsEntitiesState extends StatorEntitiesState<DataRecord> {

  constructor(
    private readonly channel: StatorChannel,
    private readonly service: RecordsService
  ) {
    super('recordsEntities', 'serial', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected _fetch(serial: string, ds: string) {
    return ds
      ? this.service.getBySerial({ ds, serial })
      : of(null);
  }


  // create
  // --------------------------------------------------------------------------------------
  create<T = DataStore>(ds: string, record: any) {
    return this.service.create<T>({ ds }, record)
      .pipe(tap(res => this._insert(res as DataRecord, ds)));
  }


  // update
  // --------------------------------------------------------------------------------------
  update<T = DataStore>(ds: string, serial: string, group: string, data: any) {
    return this.service.update<T>({ ds, serial }, { group, data })
      .pipe(tap(res => this._update(serial, res as DataRecord)));
  }


  // delete
  // --------------------------------------------------------------------------------------
  // TODO: trigger event to clear attachments, comments ...etc
  delete(ds: string, serial: string) {
    return this.service.delete({ ds, serial })
      .pipe(tap(() => this._delete(serial)));
  }
} 