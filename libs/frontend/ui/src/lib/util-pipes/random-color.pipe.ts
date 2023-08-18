import { Pipe, PipeTransform } from '@angular/core';
import { getRandomColor } from '@pestras/shared/util';

@Pipe({
  name: 'randomColor'
})
export class RandomColorPipe implements PipeTransform {

  transform(offset: number): string {
    return getRandomColor(offset);
  }
}
