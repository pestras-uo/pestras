import { Pipe, PipeTransform } from '@angular/core';
import { Report } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';
import { ReportsState } from '@pestras/frontend/state';

@Pipe({
  name: 'report'
})
export class ReportPipe implements PipeTransform {

  constructor(private state: ReportsState) { }

  transform(serial: string): Observable<Report | null> {
    return this.state.select(serial);
  }

}
