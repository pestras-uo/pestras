/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pipe, PipeTransform } from '@angular/core';
import { ContraService } from './contra.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'contraLang'
})
export class ContraLangPipe implements PipeTransform {

  constructor(private contra: ContraService) {}

  transform(_: null): Observable<string> {
    return this.contra.lang$;
  }

}
