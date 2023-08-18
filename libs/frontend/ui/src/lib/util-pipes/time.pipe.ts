import { Pipe, PipeTransform } from '@angular/core';
import { Time, parseTime } from '@pestras/shared/util';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(time: string | Time): string {
    const parsed = parseTime(time);

    if (!parsed)
      return "";

    const hours = parsed.hours > 9 ? `${parsed.hours}` : `0${parsed.hours}`;
    const minutes = parsed.minutes > 9 ? `${parsed.minutes}` : `0${parsed.minutes}`;
    const seconds = parsed.seconds > 9 ? `${parsed.seconds}` : `0${parsed.seconds}`;

    return `${hours}:${minutes}:${seconds}`;
  }
}
