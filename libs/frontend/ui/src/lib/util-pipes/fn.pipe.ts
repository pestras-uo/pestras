/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fn'
})
export class FnPipe implements PipeTransform {

  transform<T>(args: any[], fn: (...args: any[]) => T): T {
    return fn(...args);
  }

}
