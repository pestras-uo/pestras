/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { ApiQuery, DataRecord, TableDataRecord } from "@pestras/shared/data-model";
import { StatorChannel, StatorQueryState } from "@pestras/frontend/util/stator";
import { RecordsService } from "./records.service";
import { SessionState } from "../session/session.state";
import { SessionEnd } from "../session/session.events";
import { Observable, tap } from "rxjs";

export interface DataRecordsSearchResponse {
  count: number;
  results: DataRecord[];
}

@Injectable({ providedIn: 'root' })
export class RecordsState extends StatorQueryState<TableDataRecord, Partial<ApiQuery<TableDataRecord>>> {

  constructor(
    private readonly channel: StatorChannel,
    private readonly service: RecordsService,
    private readonly session: SessionState
  ) {
    super('records', 'serial', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());


  }

  protected override _fetchDoc(serial: string, ds: string): Observable<TableDataRecord | null> {
    return this.service.getBySerial({ ds, serial });
  }

  protected override _fetchQuery(ds: string, query: ApiQuery<TableDataRecord>): Observable<{ count: number; results: TableDataRecord[]; }> {
    return this.service.search({ ds }, query);
  }

  protected override _onChange(doc: TableDataRecord, ds: string): void {
    if (ds)
      this._updateInQuery(ds, doc);
  }


  // selectors
  // --------------------------------------------------------------------------------------
  selectDsRecords(ds: string) {
    return this.query(ds, {
      limit: 0
    });
  }

  // create
  // --------------------------------------------------------------------------------------
  create(ds: string, record: any) {
    return this.service.create({ ds }, record)
      .pipe(tap(res => this._insert(res, ds)));
  }


  // update
  // --------------------------------------------------------------------------------------
  update(ds: string, serial: string, group: string, data: any) {
    return this.service.update({ ds, serial }, { group, data })
      .pipe(
        tap(res => this._update(serial, res)),
        tap(res => this._onChange(res, ds))
      );
  }


  // history
  // --------------------------------------------------------------------------------------
  history(ds: string, record: string) {
    return this.service.getHistory({ ds, record });
  }

  revertHistory(ds: string, history: string) {
    return this.service.revertHistory({ ds, history })
      .pipe(
        tap(res => this._update(res.serial, res)),
        tap(res => this._onChange(res, ds))
      );
  }
}