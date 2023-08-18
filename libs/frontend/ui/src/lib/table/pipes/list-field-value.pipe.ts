/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { PuiTableColumn } from '../types';
import { objUtil, strUtil } from '@pestras/shared/util';

@Pipe({
  name: 'listFieldValue'
})
export class ListFieldValuePipe implements PipeTransform {

  transform(item: any, column: PuiTableColumn): any[] {
    const value = objUtil.getValueFromPath(column.key, item);

    if (column.srcArray) {
      return (<number[]>value).map(i => {
        return column.format
          ? strUtil.compile(column.format, item, { $: column.srcArray ? column.srcArray[i] : null })
          : (column.srcArray ? column.srcArray[i] : null);
      });

    } else if (column.srcKeyValueArray) {
      return value.map((val: any) => {
        const computeValue = column.srcKeyValueArray
          ? column.srcKeyValueArray.find((v: any) => v.value === val)?.key ?? null
          : null

        return column.format
          ? strUtil.compile(column.format, item, { $: computeValue })
          : computeValue;
      });
    }

    return (<any[]>value).map(val => {
      return column.format
        ? strUtil.compile(column.format, { $: val })
        : val || column.default;
    });
  }

}
