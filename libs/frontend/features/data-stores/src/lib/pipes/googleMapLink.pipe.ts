/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { GeoLocation } from '@pestras/shared/util';

@Pipe({
  name: 'googleMapLink'
})
export class GoogleMapLinkPipe implements PipeTransform {

  transform(value: GeoLocation): string {
    return value ? `https://www.google.com/maps/search/?api=1&query=${value.lat},${value.lng}` : '#';
  }

}
