import { Pipe, PipeTransform } from '@angular/core';
import { RecordsService } from '@pestras/frontend/state';
import { Observable, filter, isObservable, of, switchMap } from 'rxjs';
import { DataRecord } from '@pestras/shared/data-model';

@Pipe({
  name: 'record'
})
export class RecordPipe implements PipeTransform {

  constructor(private service: RecordsService) { }

  transform(serial: string | null | Observable<string | null>, ds: string ): Observable<DataRecord | null> {
    return (
      serial && typeof serial === 'string'
        ? this.service.getBySerial({ ds, serial })
        : isObservable(serial)
          ? serial.pipe(
            filter(Boolean),
            switchMap(s => this.service.getBySerial({ ds, serial: s }))
          )
          : of({ count: 0, results: [] })
    );
  }

}
