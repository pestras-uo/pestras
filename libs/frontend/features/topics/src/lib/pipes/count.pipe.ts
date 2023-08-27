import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs'
import { TopicsState } from '@pestras/frontend/state';

@Pipe({
  name: 'topicsCount'
})
export class TopicsCountPipe implements PipeTransform {

  constructor(private topicsState: TopicsState) { }

  transform(blueprint: string | null): Observable<number> {
    return this.topicsState.selectGroup(blueprint)
      .pipe(map(list => list.length));
  }

}
