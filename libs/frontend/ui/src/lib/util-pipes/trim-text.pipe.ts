import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimTextPipe implements PipeTransform {

  transform(value: string | null, count?: number): string {
    return value && count && value.length > count
      ? value.trim().slice(0, count) + '...'
      : value?.trim() ?? '';
  }
}
