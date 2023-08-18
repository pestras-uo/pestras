import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getStage'
})
export class GetStagePipe implements PipeTransform {

  transform(stages: { name: string; value: string; desc: string }[], value: string): { name: string; value: string; desc: string } | null {
    return stages.find(s => s.value === value) ?? null;
  }
}
