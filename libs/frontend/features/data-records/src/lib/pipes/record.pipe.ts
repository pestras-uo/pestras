import { Pipe, PipeTransform } from '@angular/core';
import { RecordsState } from '@pestras/frontend/state';
import { Observable, filter, isObservable, of, switchMap } from 'rxjs';
import { DataRecord } from '@pestras/shared/data-model';

@Pipe({
  name: 'record'
})
export class RecordPipe implements PipeTransform {

  constructor(private state: RecordsState) { }

  transform(serial: string | null | Observable<string | null>): Observable<DataRecord | null> {
    return (
      serial && typeof serial === 'string'
        ? this.state.select(serial)
        : isObservable(serial)
          ? serial.pipe(
            filter(Boolean),
            switchMap(s => this.state.select(s))
          )
          : of({ count: 0, results: [] })
    );
  }

}
