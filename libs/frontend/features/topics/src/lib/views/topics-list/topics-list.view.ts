/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { Role, Topic } from '@pestras/shared/data-model';
import { TopicsState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.view.html',
  styles: [``],
})
export class TopicsListView implements OnChanges {
  readonly roles = Role;

  topics$!: Observable<Topic[]>;
  preloader = false;

  @Input({ required: true })
  parent!: string | null;

  constructor(private state: TopicsState) {}

  ngOnChanges() {
    this.topics$ = this.state.selectGroup(this.parent);
  }
}
