/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { DataStoresState, RecordsState } from '@pestras/frontend/state';
import { ApiQuery } from '@pestras/shared/data-model';

@Pipe({
  name: 'selectRecord'
})
export class SelectRecordPipe implements PipeTransform {

  constructor(
    private state: RecordsState,
    private dsState: DataStoresState
  ) { }

  transform(ds: string | null, term?: string): Observable<{ name: string, value: string; }[]> {

    return !ds
      ? of([])
      : this.dsState.select(ds)
      .pipe(switchMap(d => {

        if (!d)
          return of([]);

        const interfaceField = d.settings.interface_field ?? 'serial';
        const query: ApiQuery<any> = { skip: 0, limit: 0, select: { serial: 1, [interfaceField]: 1 }, search: null, sort: null };

        if (term)
          query.search = { [interfaceField]: { $regex: term } };

        return this.state.query(d.serial, query)
          .pipe(map(list => list.results.map(r => ({ name: r[interfaceField] as string, value: r['serial'] as string }))));
      }));
  }

}
