/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';
import { BlueprintsState, OrgunitsState, RegionsState, TopicsState, UsersState } from '@pestras/frontend/state';

@Component({
  selector: 'workspace-stats',
  templateUrl: './stats.view.html',
  styles: [`
    :host {
      display: flex;
      gap: 32px;
      padding: 32px 32px 0;
    }

    .stats-value {
      padding-inline-start: 42px;
      line-height: 1.5rem;
    }
  `],
})
export class StatsView {

  constructor(
    private bpsState: BlueprintsState,
    private topicsState: TopicsState,
    private orgsState: OrgunitsState,
    private usersState: UsersState,
    private regionsState: RegionsState
  ) { }
}
