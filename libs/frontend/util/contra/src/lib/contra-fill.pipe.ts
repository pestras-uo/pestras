/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { strUtil } from '@pestras/shared/util';

@Pipe({
  name: 'contraFill'
})
export class ContraFillPipe implements PipeTransform {

  transform(key: string, c: Record<string, any>): string {
    return strUtil.compile(c[key], c);
  }

}
