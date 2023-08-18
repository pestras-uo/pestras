/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayInclude'
})
export class ArrayIncludePipe implements PipeTransform {

  transform(arr: any[] | null, el: any): boolean {
    return arr ? arr.includes(el) : false;
  }

}
