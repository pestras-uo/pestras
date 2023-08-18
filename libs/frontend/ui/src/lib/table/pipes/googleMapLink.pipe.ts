/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { PuiTableColumn } from '../types';
import { objUtil } from '@pestras/shared/util';

@Pipe({
  name: 'googleMapLink'
})
export class GoogleMapLinkPipe implements PipeTransform {

  transform(item: any, column: PuiTableColumn): string {
    const value = objUtil.getValueFromPath(column.key, item);

    return value ? `https://www.google.com/maps/search/?api=1&query=${value.lat},${value.lng}` : '#';
  }

}
