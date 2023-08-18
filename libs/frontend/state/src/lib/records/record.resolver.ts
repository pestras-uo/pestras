import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DataRecord } from '@pestras/shared/data-model';
import { RecordsEntitiesState } from './records-entities.state';
import { Observable, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecordResolver<T extends DataRecord> implements Resolve<T | null> {

  constructor(private recordsState: RecordsEntitiesState) { }

  resolve(route: ActivatedRouteSnapshot): Observable<T | null> {
    return this.recordsState
      .select(route.paramMap.get('record') || '', route.paramMap.get('dataStore') || '').pipe(filter(Boolean)) as Observable<T | null>;
  }
}