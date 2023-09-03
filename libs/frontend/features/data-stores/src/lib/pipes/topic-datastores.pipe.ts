import { Pipe, PipeTransform } from '@angular/core';
import { DataStore } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';
import { DataStoresState } from '@pestras/frontend/state';

@Pipe({
  name: 'topicDataStores'
})
export class TopicDataStoresPipe implements PipeTransform {

  constructor(private state: DataStoresState) { }

  transform(blueprint: string): Observable<DataStore[]> {
    return this.state.selectGroup(blueprint);
  }
}
