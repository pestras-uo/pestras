/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { ContraService } from './contra.service';

@Pipe({
  name: 'contraFill'
})
export class ContraFillPipe implements PipeTransform {

  constructor(private contra: ContraService) {}

  transform(key: string, resources: string[] = []): string {
    return this.contra.fill(key, {}, resources);
  }

}
