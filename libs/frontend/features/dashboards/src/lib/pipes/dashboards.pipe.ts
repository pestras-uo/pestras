import { Pipe, PipeTransform } from '@angular/core';
import { Dashboard } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';
import { DashboardsState } from '@pestras/frontend/state';

@Pipe({
  name: 'dashboards'
})
export class DashboardsPipe implements PipeTransform {

  constructor(private state: DashboardsState) { }

  transform(topic: string | null): Observable<Dashboard[]> {
    return this.state.selectGroup(topic);
  }
}
