import { Pipe, PipeTransform } from '@angular/core';
import { RecordsService } from '@pestras/frontend/state';
import { Observable, filter, isObservable, map, of, switchMap } from 'rxjs';
import { DataRecord } from '@pestras/shared/data-model';

@Pipe({
  name: 'searchRecords'
})
export class RecordsSearchPipe implements PipeTransform {

  constructor(private service: RecordsService) { }

  transform(ds: string | null | Observable<string | null>, search = {}): Observable<DataRecord[]> {
    return (
      ds && typeof ds === 'string'
        ? this.service.search({ ds }, { search })
        : isObservable(ds)
          ? ds.pipe(
            filter(Boolean),
            switchMap(s => this.service.search({ ds: s }, { search }))
          )
          : of({ count: 0, results: [] })
    )
      .pipe(map(res => res ? res.results : []))
  }

}
