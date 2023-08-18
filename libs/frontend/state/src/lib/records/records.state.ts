/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { ApiQuery, DataRecord, WorkflowState } from "@pestras/shared/data-model";
import { StatorChannel, StatorState } from "@pestras/frontend/util/stator";
import { RecordsService } from "./records.service";
import { SessionState } from "../session/session.state";
import { SessionEnd } from "../session/session.events";

export interface DataRecordsSearchResponse {
  count: number;
  results: DataRecord[];
}

@Injectable({ providedIn: 'root' })
export class RecordsState extends StatorState<DataRecordsSearchResponse> {

  constructor(
    private readonly channel: StatorChannel,
    private readonly service: RecordsService,
    private readonly session: SessionState
  ) {
    super('records', { count: 0, results: [] }, ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetch(key: string) {
    return this.service.search({ ds: key }, {
      skip: 0,
      limit: 10000,
      search: {},
      sort: { serial: 1 },
      select: null
    } as ApiQuery<any>);
  }

  getPublic<T = DataRecord>(
    dataStore: string,
    skip = 0,
    searchTerm = "",
    sort: Record<string, 1 | -1> = { serial: -1 }
  ) {
    const search: any = { workflow: WorkflowState.APPROVED };

    if (searchTerm)
      search.name = { $regex: searchTerm };

    return this.service.search<T>({ ds: dataStore }, {
      skip,
      limit: 20,
      search,
      sort
    } as ApiQuery<any>)
  }

  getOwned<T = DataRecord>(dataStore: string, workflow: WorkflowState, skip = 0, searchTerm = "", sort: Record<string, 1 | -1> = { serial: -1 }) {
    const search: any = { owner: this.session.get()?.serial, workflow };

    if (searchTerm)
      search.name = { $regex: searchTerm };

    return this.service.search<T>({ ds: dataStore }, {
      skip,
      limit: 20,
      search,
      sort
    } as ApiQuery<any>)
  }

  data(dataStore: string, skip = 0, limit = 1000) {
    return this.service.search({ ds: dataStore }, { skip, limit } as ApiQuery<any>)
  }

  search<T = DataRecord>(dataStore: string, query: ApiQuery<any>) {
    return this.service.search<T>({ ds: dataStore }, query);
  }
}