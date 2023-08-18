import { Pipe, PipeTransform } from '@angular/core';
import { DataStore, DataStoreType } from '@pestras/shared/data-model';
import { Observable, map } from 'rxjs';
import { DataStoresState } from '@pestras/frontend/state';

@Pipe({
  name: 'blueprintDataStores'
})
export class BlueprintDataStoresPipe implements PipeTransform {

  constructor(private state: DataStoresState) { }

  transform(blueprint: string, types?: DataStoreType[]): Observable<DataStore[]> {
    const data$ = this.state.selectGroup(blueprint);

    return types?.length
      ? data$.pipe(map(list => list.filter(ds => types.includes(ds.type))))
      : data$
  }
}
