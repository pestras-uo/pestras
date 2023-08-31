/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersGroupsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styles: [`
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      height: var(--main-height);
    }
  `]
})
export class GroupsPage {

  readonly name = new FormControl('', { nonNullable: true, validators: Validators.required });

  addModal = false;
  dialogRef: DialogRef | null = null;
  selected = "";
  preloader = true;

  @Input()
  set group(value: string) {
    this.selected = value;
  }

  constructor(
    private state: UsersGroupsState,
    private dialog: Dialog,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  set(serial: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { group: serial } })
  }

  openDialog(modal: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(modal);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
    this.name.reset();
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.create(this.name.value)
      .subscribe({
        next: o => {
          this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
          this.selected = o.serial;
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
