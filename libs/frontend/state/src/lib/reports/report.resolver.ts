import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Report } from '@pestras/shared/data-model';
import { Observable, filter } from 'rxjs';
import { ReportsState } from './reports.state';

@Injectable({ providedIn: 'root' })
export class ReportResolver<T extends Report> implements Resolve<T | null> {

  constructor(private state: ReportsState) { }

  resolve(route: ActivatedRouteSnapshot): Observable<T | null> {
    return this.state
      .select(route.paramMap.get('report') || '').pipe(filter(Boolean)) as Observable<T | null>;
  }
}