/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DashboardsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { Dashboard } from '@pestras/shared/data-model';

@Component({
  selector: 'pestras-dashboard-access',
  templateUrl: './access.view.html',
  styles: [
  ]
})
export class AccessViewComponent {

  readonly control = new FormControl('', { validators: Validators.required, nonNullable: true });

  preloader = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  dashboard!: Dashboard;

  constructor(
    private state: DashboardsState,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  openDialog(tmp: TemplateRef<any>, type: string) {
    this.dialogRef = this.dialog.open(tmp, { data: type });
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
    this.control.reset();
  }

  filterEntity<T extends { serial: string; }>(entity: T, options: string[] = [], exclude = false) {
    return exclude 
    ? !options.includes(entity.serial)
    : options.includes(entity.serial);
  }

  mapEntity<T extends { serial: string; name?: string; fullname?: string; }>(entity: T) {
    return { name: entity.name ?? entity.fullname, value: entity.serial };
  }

  add(c: Record<string, any>, type: string) {
    this.preloader = true;

    (
      type === 'orgunit'
        ? this.state.addAccessOrgunit(this.dashboard.serial, this.control.value)
        : type === 'user'
          ? this.state.addAccessUser(this.dashboard.serial, this.control.value)
          : this.state.addAccessGroup(this.dashboard.serial, this.control.value)
    )
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

  remove(c: Record<string, any>, type: string, serial: string) {
    (
      type === 'orgunit'
        ? this.state.removeAccessOrgunit(this.dashboard.serial, serial)
        : type === 'user'
          ? this.state.removeAccessUser(this.dashboard.serial, serial)
          : this.state.removeAccessGroup(this.dashboard.serial, serial)
    )
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
