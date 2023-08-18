import { Pipe, PipeTransform } from '@angular/core';
import { Dashboard } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';
import { DashboardsState } from '@pestras/frontend/state';

@Pipe({
  name: 'dashboard'
})
export class DashboardPipe implements PipeTransform {

  constructor(private state: DashboardsState) { }

  transform(serial: string): Observable<Dashboard | null> {
    return this.state.select(serial);
  }

}
