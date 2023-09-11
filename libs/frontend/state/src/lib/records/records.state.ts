/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { ApiQuery, DataRecord, TableDataRecord } from "@pestras/shared/data-model";
import { StatorChannel, StatorEntitiesState } from "@pestras/frontend/util/stator";
import { RecordsService } from "./records.service";
import { SessionEnd } from "../session/session.events";
import { Observable, tap } from "rxjs";

export interface DataRecordsSearchResponse {
  count: number;
  results: DataRecord[];
}

@Injectable({ providedIn: 'root' })
export class RecordsState extends StatorEntitiesState<TableDataRecord> {

  constructor(
    private readonly channel: StatorChannel,
    private readonly service: RecordsService
  ) {
    super('records', 'serial', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());


  }

  protected override _fetch(serial: string, ds: string): Observable<TableDataRecord | null> {
    return this.service.getBySerial({ ds, serial });
  }


  // selectors
  // --------------------------------------------------------------------------------------
  search(ds: string, query: Partial<ApiQuery<TableDataRecord>> | null = null) {
    return this.service.search({ ds }, query ?? {});
  }

  // create
  // --------------------------------------------------------------------------------------
  create(ds: string, record: any) {
    return this.service.create({ ds }, record)
      .pipe(tap(res => this._insert(res, ds)));
  }


  // update
  // --------------------------------------------------------------------------------------
  update(ds: string, serial: string, data: any) {
    return this.service.update({ ds, serial }, data)
      .pipe(tap(res => this._update(serial, res)));
  }


  // history
  // --------------------------------------------------------------------------------------
  history(ds: string, record: string) {
    return this.service.getHistory({ ds, record });
  }

  revertHistory(ds: string, history: string) {
    return this.service.revertHistory({ ds, history })
      .pipe(tap(res => this._update(res.serial, res)));
  }
}