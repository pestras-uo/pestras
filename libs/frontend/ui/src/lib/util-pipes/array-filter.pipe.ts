/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {

  transform<T>(arr: T[] | null, filter: (item: T, ...args: any[]) => boolean, ...args: any[]): T[] {
    return arr ? arr.filter((item) => filter(item, ...args)) : [];
  }

}
