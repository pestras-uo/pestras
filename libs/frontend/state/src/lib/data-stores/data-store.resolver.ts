import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DataStore } from '@pestras/shared/data-model';
import { Observable, filter } from 'rxjs';
import { DataStoresState } from './data-stores.state';

@Injectable({ providedIn: 'root' })
export class DataStoreResolver<T extends DataStore> implements Resolve<T | null> {

  constructor(private state: DataStoresState) { }

  resolve(route: ActivatedRouteSnapshot): Observable<T | null> {
    console.log('resolving dataStore:', route.paramMap.get('dataStore'))
    return this.state
      .select(route.paramMap.get('dataStore') || '').pipe(filter(Boolean)) as Observable<T | null>;
  }
}