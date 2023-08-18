/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { strUtil } from '@pestras/shared/util';

@Pipe({
  name: 'rowTitle'
})
export class RowTitlePipe implements PipeTransform {

  transform(item: any, hint?: string): string {
    if (!hint)
      return '';

    return strUtil.compile(hint, item);
  }

}
