import { Pipe, PipeTransform } from '@angular/core';
import { DataStore } from '@pestras/shared/data-model';
import { Observable, isObservable, switchMap, of } from 'rxjs';
import { DataStoresState } from '@pestras/frontend/state';

@Pipe({
  name: 'dataStore'
})
export class DataStorePipe implements PipeTransform {

  constructor(private state: DataStoresState) { }

  transform(serial: string | null | Observable<string | null>, blueprint?: string): Observable<DataStore | null> {
    return serial && typeof serial === 'string'
      ? this.state.select(serial ?? '', blueprint)
      : isObservable(serial)
        ? serial.pipe(switchMap(s => s ? this.state.select(s, blueprint) : of(null)))
        : of(null);
  }
}
