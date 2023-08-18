/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFind'
})
export class ArrayFindPipe implements PipeTransform {

  transform<T = any>(arr: T[] | null, find: (item: T, ...args: any[]) => boolean, ...args: any[]): T | null {
    return arr
      ? arr.find(el => find(el, ...args)) ?? null
      : null
  }

}
