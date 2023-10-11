import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DataRecordState, TableDataRecord } from '@pestras/shared/data-model';
import { Observable, filter } from 'rxjs';
import { RecordsService } from './records.service';

@Injectable({ providedIn: 'root' })
export class RecordResolver implements Resolve<TableDataRecord | null> {

  constructor(private service: RecordsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<TableDataRecord | null> {
    const state = route.queryParamMap.get('state') as DataRecordState;
    const ds = route.paramMap.get('dataStore');
    const src = (!state || state === 'published' ? ds : `${state}_${ds}`) as string;
    return this.service
      .getBySerial({ serial: route.paramMap.get('record') || '', ds: src })
      .pipe(
        filter(Boolean)
      ) as Observable<TableDataRecord | null>;
  }
}