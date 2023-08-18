/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraySlice'
})
export class ArraySlicePipe implements PipeTransform {

  transform(arr: any[] | null, start: number, end?: number): any[] {
    return arr ? arr.slice(start, end) : [];
  }

}
