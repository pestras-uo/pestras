import { Pipe, PipeTransform } from '@angular/core';
import { Topic } from '@pestras/shared/data-model';
import { Observable } from 'rxjs'
import { TopicsState } from '@pestras/frontend/state';

@Pipe({
  name: 'topics'
})
export class TopicsPipe implements PipeTransform {

  constructor(private topicsState: TopicsState) {}

  transform(blueprint: string | null): Observable<Topic[]> {
    return this.topicsState.selectGroup(blueprint);
  }

}
