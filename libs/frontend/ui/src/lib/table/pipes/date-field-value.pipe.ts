/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { PuiColumnConfig } from '../types';
import { objUtil } from '@pestras/shared/util';

@Pipe({
  name: 'dateFieldValue'
})
export class DateFieldValuePipe implements PipeTransform {

  transform(item: any, column: PuiColumnConfig): any {
    return column.formatter 
    ? column.formatter(column.key, objUtil.getValueFromPath(column.key, item), item)
    : objUtil.getValueFromPath(column.key, item);
  }

}
