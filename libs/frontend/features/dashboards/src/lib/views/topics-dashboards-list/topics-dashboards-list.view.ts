/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Dashboard } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { DashboardsState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-topic-dashboards-list',
  templateUrl: './topics-dashboards-list.view.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TopicDashboardsListView implements OnChanges {
  dashboards$!: Observable<Dashboard[]>;
  dialogRef: DialogRef | null = null;
  preloader = false;

  readonly title = new FormControl('', {
    validators: Validators.required,
    nonNullable: true,
  });

  @Input({ required: true })
  topic!: string;

  constructor(
    private state: DashboardsState,
    private dialog: Dialog,
    private toast: ToastService
  ) {}

  ngOnChanges(): void {
    this.dashboards$ = this.state.selectGroup(this.topic);
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;

    this.title.reset();
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.create(this.topic, this.title.value).subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
        this.closeDialog();
      },
      error: (e) => {
        console.error(e);

        this.toast.msg(c['errors'][e?.error] || c['errors'].default, {
          type: 'error',
        });
        this.preloader = false;
      },
    });
  }
}
