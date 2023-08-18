import { Pipe, PipeTransform } from '@angular/core';
import { RegionsState } from '@pestras/frontend/state';
import { Region } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Pipe({
  name: 'region'
})
export class RegionPipe implements PipeTransform {

  constructor(private regionsState: RegionsState) {}

  transform(serial: string): Observable<Region | null> {
    return this.regionsState.select(serial);
  }

}
