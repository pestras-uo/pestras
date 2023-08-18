/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { PuiColumnConfig } from '../types';
import { objUtil } from '@pestras/shared/util';

@Pipe({
  name: 'boolFieldValue'
})
export class GetBoolFieldValuePipe implements PipeTransform {

  transform(item: any, column: PuiColumnConfig): boolean {
    return column.formatter 
      ? column.formatter(column.key, !objUtil.getValueFromPath(column.key, item), item)
      : !!objUtil.getValueFromPath(column.key, item);
  }

}
