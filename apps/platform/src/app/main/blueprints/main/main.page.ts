/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss']
})
export class MainPage {    
  dialogRef?: DialogRef;
  preloader = false;
  selected = '';

  @Input({ required: true })
  set active(value: string) {
    this.selected = value ?? '';
  }

  constructor(
    private state: BlueprintsState,
    private dialog: Dialog,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  set(serial: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { active: serial } });
  }

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
