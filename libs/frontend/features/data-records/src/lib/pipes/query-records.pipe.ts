/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiQuery, DataRecord } from '@pestras/shared/data-model';
import { RecordsState } from '@pestras/frontend/state';

@Pipe({
  name: 'queryRecords'
})
export class QueryRecordsPipe implements PipeTransform {

  constructor(private state: RecordsState) { }

  transform(ds: string, query: ApiQuery<any>): Observable<DataRecord[]> {
    return this.state.search(ds, query)
      .pipe(map(res => res.results));
  }

}
