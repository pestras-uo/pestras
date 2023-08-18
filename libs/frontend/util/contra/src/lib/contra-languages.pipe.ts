/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pipe, PipeTransform } from '@angular/core';
import { ContraService } from './contra.service';
import { ContraLanguage } from './config';

@Pipe({
  name: 'contraLanguages'
})
export class ContraLanguagesPipe implements PipeTransform {

  constructor(private contra: ContraService) {}

  transform(_: null): ContraLanguage[] {
    return this.contra.languages;
  }

}
