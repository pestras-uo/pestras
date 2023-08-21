/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fn'
})
export class FnPipe implements PipeTransform {

  transform<T>(input: any, fn: (...args: any[]) => T, ...extra: any[]): any {
    return fn(input, ...extra);
  }

}
