/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { PuiTableColumn } from '../types';

@Pipe({
  name: 'skipValue'
})
export class SkipValuePipe implements PipeTransform {

  transform(item: any, column: PuiTableColumn): boolean {
    if (column.skip === undefined)
      return false;

    if (typeof column.skip === "function")
      return column.skip(item);

    return column.skip;
  }

}
