import { Pipe, PipeTransform } from '@angular/core';
import { Topic } from '@pestras/shared/data-model';
import { Observable, of } from 'rxjs'
import { TopicsState } from '@pestras/frontend/state';

@Pipe({
  name: 'topic'
})
export class TopicPipe implements PipeTransform {

  constructor(private topicsState: TopicsState) {}

  transform(serial: string | null): Observable<Topic | null> {
    return serial ? this.topicsState.select(serial ?? '') : of(null)
  }

}