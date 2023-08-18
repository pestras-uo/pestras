/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { PuiColumnConfig } from '../types';
import { objUtil, strUtil } from '@pestras/shared/util';

@Pipe({
  name: 'numberFieldValue'
})
export class NumberFieldValuePipe implements PipeTransform {

  transform(item: any, column: PuiColumnConfig): number {
    return column.formatter
      ? column.formatter(column.key, objUtil.getValueFromPath(column.key, item), item)
      : column.format
        ? strUtil.compile(column.format, item)
        : objUtil.getValueFromPath(column.key, item);
  }

}
