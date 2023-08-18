import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Blueprint } from '@pestras/shared/data-model';
import { Observable, filter } from 'rxjs';
import { BlueprintsState } from './blueprints.state';

@Injectable({ providedIn: 'root' })
export class BlueprintResolver<T extends Blueprint> implements Resolve<T | null> {

  constructor(private state: BlueprintsState) { }

  resolve(route: ActivatedRouteSnapshot): Observable<T | null> {
    return this.state
      .select(route.paramMap.get('blueprint') || '').pipe(filter(Boolean)) as Observable<T | null>;
  }
}