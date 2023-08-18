/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayMap'
})
export class ArrayMapPipe implements PipeTransform {

  transform<T, U>(arr: T[] | null, mapper: (item: T, ...args: any[]) => U, ...args: any[]): U[] {
    return arr ? arr.map(item => mapper(item, ...args)) : [];
  }

}
