import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Dashboard } from '@pestras/shared/data-model';
import { Observable, filter } from 'rxjs';
import { DashboardsState } from './dashboards.state';

@Injectable({ providedIn: 'root' })
export class DashboardResolver<T extends Dashboard> implements Resolve<T | null> {

  constructor(private state: DashboardsState) { }

  resolve(route: ActivatedRouteSnapshot): Observable<T | null> {
    return this.state
      .select(route.paramMap.get('dashboard') || '').pipe(filter(Boolean)) as Observable<T | null>;
  }
}