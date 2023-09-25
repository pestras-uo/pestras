import { Pipe, PipeTransform } from '@angular/core';
import { RecordsService } from '@pestras/frontend/state';
import { Observable, filter, isObservable, map, of, switchMap } from 'rxjs';
import { DataRecord } from '@pestras/shared/data-model';

@Pipe({
  name: 'records'
})
export class RecordsPipe implements PipeTransform {

  constructor(private service: RecordsService) { }

  transform(ds: string | null | Observable<string | null>, skip = 0, limit = 1000): Observable<DataRecord[]> {
    return (
      ds && typeof ds === 'string'
        ? this.service.search({ ds }, { skip, limit })
        : isObservable(ds)
          ? ds.pipe(
            filter(Boolean),
            switchMap(s => this.service.search({ ds: s }, { skip, limit }))
          )
          : of({ count: 0, results: [] })
    )
      .pipe(map(res => res ? res.results : []))
  }

}
