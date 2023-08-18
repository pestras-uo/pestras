import { Pipe, PipeTransform } from '@angular/core';
import { Field } from '@pestras/shared/data-model';
import { Observable, isObservable, switchMap, of, map } from 'rxjs';
import { DataStoresState } from '@pestras/frontend/state';

@Pipe({
  name: 'dataStoreFields'
})
export class DataStoreFieldsPipe implements PipeTransform {

  constructor(private state: DataStoresState) { }

  transform(serial: string | null | Observable<string | null>, blueprint?: string): Observable<Field[]> {
    return serial && typeof serial === 'string'
      ? this.state.select(serial ?? '', blueprint).pipe(map(ds => ds ? ds.fields : []))
      : isObservable(serial)
        ? serial.pipe(switchMap(s => s ? this.state.select(s, blueprint) : of(null)))
          .pipe(map(ds => ds ? ds.fields : []))
        : of([]);
  }
}
