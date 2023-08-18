/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { PuiColumnConfig } from '../types';
import { strUtil, objUtil } from '@pestras/shared/util';

@Pipe({
  name: 'stringFieldValue'
})
export class StringFieldValuePipe implements PipeTransform {

  transform(item: any, column: PuiColumnConfig): any {
    if (column.srcArray) {
      const value = objUtil.getValueFromPath(column.key, item);

      return column.formatter
        ? column.formatter(column.key, value, item)
        : column.format
          ? strUtil.compile(column.format, item, { $: column.srcArray[value] })
          : column.srcArray[value];

    } else if (column.srcKeyValueArray) {
      const value = objUtil.getValueFromPath(column.key, item);
      const computeValue = column.srcKeyValueArray
        .find((v: any) => v.value === value)?.key;

      return column.formatter
        ? column.formatter(column.key, computeValue, item)
        : column.format
          ? strUtil.compile(column.format, item, { $: computeValue })
          : computeValue;
    }

    return column.formatter
      ? column.formatter(column.key, objUtil.getValueFromPath(column.key, item), item)
      : column.format
        ? strUtil.compile(column.format, item)
        : objUtil.getValueFromPath(column.key, item) || column.default;
  }

}
