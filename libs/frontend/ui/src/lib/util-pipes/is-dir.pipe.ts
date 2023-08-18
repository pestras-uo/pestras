import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isDir'
})
export class IsDirPipe implements PipeTransform {

  transform(dir: string): unknown {
    return (document.documentElement.dir || 'ltr') === dir;
  }

}
