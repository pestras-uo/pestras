/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef, computed, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DashboardsState, SessionState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { tap } from 'rxjs';

@Component({
  selector: 'pestras-dashboards-main-page',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPageComponent {
  readonly dashboards$ = computed(
    () => (this.tab() === 'public'
      ? this.state.search({ skip: this.skip(), limit: 10 })
      : this.state.search({ skip: this.skip(), limit: 10, search: { owner: this.session.get()?.serial } }))
      .pipe(tap(res => this.count = res.count))
  );

  readonly title = new FormControl<string>('', { validators: Validators.required, nonNullable: true });

  count = 0;
  tab = signal('public');
  skip = signal(0);
  dialogRef: DialogRef | null = null;
  preloader = false;

  constructor(
    public state: DashboardsState,
    private dialog: Dialog,
    private toast: ToastService,
    private session: SessionState
  ) { }

  load() {
    if (this.skip() + 10 < this.count)
      this.skip.set(this.skip() + 10);
  }

  openDialog(tmp: TemplateRef<unknown>) {
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

    this.state.create(null, this.title.value)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeDialog();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
