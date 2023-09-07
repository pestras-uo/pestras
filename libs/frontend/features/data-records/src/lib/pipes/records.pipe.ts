import { Pipe, PipeTransform } from '@angular/core';
import { RecordsState } from '@pestras/frontend/state';
import { Observable, filter, isObservable, map, of, switchMap } from 'rxjs';
import { DataRecord } from '@pestras/shared/data-model';

@Pipe({
  name: 'records'
})
export class RecordsPipe implements PipeTransform {

  constructor(private state: RecordsState) { }

  transform(serial: string | null | Observable<string | null>, skip = 0, limit = 1000): Observable<DataRecord[]> {
    return (
      serial && typeof serial === 'string'
        ? this.state.query(serial, { skip, limit })
        : isObservable(serial)
          ? serial.pipe(
            filter(Boolean),
            switchMap(s => this.state.query(s, { skip, limit }))
          )
          : of({ count: 0, results: [] })
    )
      .pipe(map(res => res ? res.results : []))
  }

}
