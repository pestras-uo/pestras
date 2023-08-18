/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { Workspace, WorkspaceDashboardSlide } from '@pestras/shared/data-model';
import { WorkspaceState } from '@pestras/frontend/state';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-workspace-toggle-slide',
  templateUrl: './workspace-toggle-slide.view.html',
  styles: [
  ]
})
export class WorkspaceToggleSlideView implements OnChanges {
  ws$!: Observable<Workspace | null>;

  pinned = false;
  disabled = false;

  @Input({ required: true })
  input!: WorkspaceDashboardSlide;

  constructor(private state: WorkspaceState) { }

  ngOnChanges() {
    this.ws$ = this.state.select()
      .pipe(tap(ws => {
        if (ws)
          this.pinned = !!ws.slides.find(s => s.slide === this.input.slide);
      }));
  }

  pin() {
    this.disabled = true;

    this.state.addSlide(this.input)
      .subscribe({
        next: () => this.disabled = false,
        error: e => {
          console.error(e);
          this.disabled = false;
        }
      })
  }

  unpin() {
    this.disabled = true;

    this.state.removeSlide(this.input.slide)
      .subscribe({
        next: () => this.disabled = false,
        error: e => {
          console.error(e);
          this.disabled = false;
        }
      })
  }
}
