/* eslint-disable @angular-eslint/directive-selector */
import { Directive } from '@angular/core';
import { ContraService } from './contra.service';

@Directive({
  selector: '[contraLang]',
  exportAs: 'contra'
})
export class ContraLangDirective {

  constructor(
    private readonly service: ContraService
  ) { }

  setLang(key: string) {
    this.service.changeLanguage(key);
  }

}
