/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { ClientApi } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { ClientApiState } from '@pestras/frontend/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clients-api-list',
  templateUrl: './clients-api-list.view.html',
  styles: [
  ]
})
export class ClientsApiListView implements OnChanges {

  list$!: Observable<ClientApi[]>;
  preloader = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  blueprint!: string;
  @Input({ required: true })
  editable = false;

  constructor(
    private state: ClientApiState,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnChanges() {
    this.list$ = this.state.selectGroup(this.blueprint);
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;
  }

  add(c: Record<string, any>, name: string) {
    this.preloader = true;

    this.state.create(this.blueprint, name)
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
      })
  }
}
