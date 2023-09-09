import { Inject, Pipe, PipeTransform } from '@angular/core';
import { PUI_UTIL_PIPES_CONFIG, PuiUtilPipesConfig } from './config';

@Pipe({
  name: 'docsPath'
})
export class DocsPathPipe implements PipeTransform {

  constructor(@Inject(PUI_UTIL_PIPES_CONFIG) private config: PuiUtilPipesConfig) {}

  transform(value: string, dir = 'default'): string {
    return (this.config[dir] || '') + value;
  }
}
