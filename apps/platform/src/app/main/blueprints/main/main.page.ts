/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef } from '@angular/core';
import { BlueprintsState, SessionState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Role } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { map } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss']
})
export class MainPage {
  readonly roles = Role;

  readonly bps$ = this.state.data$
    .pipe(map(list => {
      const session = this.session.get();

      return session?.roles.includes(Role.ADMIN)
        ? list.filter(b => Serial.isBranch(b.orgunit, session.orgunit, true))
        // otherwise is data engineer
        : list.filter(b => b.owner === session?.serial || b.collaborators.includes(session?.serial || ''));
    }));

  addModal = false;
  dialogRef?: DialogRef;
  preloader = false;

  constructor(
    private state: BlueprintsState,
    private dialog: Dialog,
    private session: SessionState,
    private toast: ToastService
  ) { }

  openDialog(modal: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(modal);
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  add(c: Record<string, any>, name: string) {
    this.preloader = true;

    this.state.create(name)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
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
