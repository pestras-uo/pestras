/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DashboardsState, SessionState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Role } from '@pestras/shared/data-model';
import { BehaviorSubject, combineLatest, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'pestras-dashboards-main-page',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPageComponent {
  readonly roles = Role;
  readonly tab$ = new BehaviorSubject('public');
  readonly page$ = new BehaviorSubject(1);
  readonly pageSize = 10;

  readonly dashboards$ = combineLatest([this.tab$, this.page$.pipe(distinctUntilChanged())])
    .pipe(
      switchMap(([tab, page]) => {
        this.skip = (page - 1) * this.pageSize;

        return tab === 'public'
          ? this.state.search({ skip: this.skip, limit: 10, search: { topic: null } })
          : this.state.search({ skip: this.skip, limit: 10, search: { topic: null, owner: this.session.get()?.serial } })
      }),
      tap(res => this.count = res.count)
    );

  readonly title = new FormControl<string>('', { validators: Validators.required, nonNullable: true });

  count = 0;
  skip = 0;
  dialogRef: DialogRef | null = null;
  preloader = false;

  constructor(
    public state: DashboardsState,
    private dialog: Dialog,
    private toast: ToastService,
    private session: SessionState
  ) { }

  load() {
    if (this.skip + 10 < this.count)
      this.skip = this.skip + 10;
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
