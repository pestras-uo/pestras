/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, of, map, switchMap } from 'rxjs'
import { RegionsState, OrgunitsState, UsersState, DataStoresState, CategoriesState, TopicsState, RecordsService } from '@pestras/frontend/state';
import { TypedEntity } from '@pestras/shared/data-model';

@Pipe({
  name: 'fieldValue'
})
export class fieldValuePipe implements PipeTransform {

  constructor(
    private readonly regionsState: RegionsState,
    private readonly datePipe: DatePipe,
    private readonly orgsState: OrgunitsState,
    private readonly usersState: UsersState,
    private readonly recordsService: RecordsService,
    private readonly dsState: DataStoresState,
    private readonly catsState: CategoriesState,
    private readonly topicsState: TopicsState
  ) { }

  transform(value: any, entity: TypedEntity): Observable<any> {
    if (entity.type === 'boolean')
      return of(+value);

    if (entity.type === 'date')
      return of(this.datePipe.transform(value, 'dd/MM/YYYY'));

    if (entity.type === 'datetime')
      return of(this.datePipe.transform(value, 'dd/MM/YYYY - HH:mm:ss'));

    if (entity.type === 'region')
      return this.regionsState.select(value).pipe(map(r => r?.name || null));

    if (entity.type === 'serial' && entity.ref_type === 'orgunit')
      return this.orgsState.select(value as string).pipe(map(c => c?.name || null));

    if (entity.type === 'serial' && entity.ref_type === 'topic')
      return this.topicsState.select(value as string).pipe(map(c => c?.name || null));

    if (entity.type === 'serial' && entity.ref_type === 'user')
      return this.usersState.select(value as string).pipe(map(c => c?.fullname || c?.username || null));

    if (entity.type === 'category')
      return this.catsState.select(c => c.value === value).pipe(map(c => c?.title ?? value));

    if (entity.type === 'serial' && entity.ref_type === 'data_store' && entity.ref_to)
      return this.recordsService.getBySerial({ serial: value, ds: entity.ref_to })
        .pipe(switchMap(r => {
          if (!r || !entity.ref_to)
            return of(null);

          return this.dsState.select(entity.ref_to)
            .pipe(map(ds => {
              if (!ds)
                return of(null);

              return r[ds.settings.interface_field ?? 'serial']
            }));
        }));

    return of(value);
  }
}
