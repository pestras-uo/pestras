import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DataRecord } from '@pestras/shared/data-model';
import { Observable, filter } from 'rxjs';
import { RecordsState } from './records.state';

@Injectable({ providedIn: 'root' })
export class RecordResolver<T extends DataRecord> implements Resolve<T | null> {

  constructor(private recordsState: RecordsState) { }

  resolve(route: ActivatedRouteSnapshot): Observable<T | null> {
    return this.recordsState
      .select(route.paramMap.get('record') || '', route.paramMap.get('dataStore') || '').pipe(filter(Boolean)) as Observable<T | null>;
  }
}