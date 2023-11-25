/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { objUtil } from '@pestras/shared/util';

@Pipe({
  name: 'clone'
})
export class ClonePipe implements PipeTransform {

  transform<T>(input: any): T {
    return Array.isArray(input)
      ? input.map(i => objUtil.cloneObject(i))
      : objUtil.cloneObject(input);
  }

}
