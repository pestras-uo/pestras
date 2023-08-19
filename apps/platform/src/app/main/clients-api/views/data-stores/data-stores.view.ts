/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, HostBinding, Input, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClientApiState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { ClientApi, ClientApiDataStore, DataStore } from '@pestras/shared/data-model';

@Component({
  selector: 'app-data-stores',
  templateUrl: './data-stores.view.html',
})
export class DataStoresView {

  readonly form = this.fb.nonNullable.group({
    max: [1000, Validators.required],
    method: this.fb.nonNullable.control<'GET' | 'POST'>('GET', Validators.required),
    topic: ''
  });
  readonly methods = [
    { name: 'GET', value: 'GET' },
    { name: 'POST', value: 'POST' }
  ];
  readonly dsControl = new FormControl('', { nonNullable: true, validators: Validators.required });
  readonly dsSearch = new FormControl('', { nonNullable: true });

  preloader = false;
  dialogRef: DialogRef | null = null;

  @HostBinding('class')
  hostClass = 'card';

  @Input({ required: true })
  blueprint!: string;
  @Input({ required: true })
  client!: ClientApi;
  @Input()
  editable = false;

  constructor(
    private state: ClientApiState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  openDialog(tmp: TemplateRef<any>, ds?: ClientApiDataStore) {
    if (ds) {
      this.form.controls.max.setValue(ds.max);
      this.form.controls.method.setValue(ds.method);
    }

    this.dialogRef = this.dialog.open(tmp, { data: ds });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    this.preloader = false;
    this.form.reset();
  }

  mapDataStore(ds: DataStore) {
    return { name: ds.name, value: ds.serial };
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.addDataStore(this.client.serial, this.dsControl.value, this.form.getRawValue())
      .subscribe({
        next: () => {          
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeDialog();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.closeDialog();
        }
      })
  }

  update(c: Record<string, any>, ds: string) {
    this.preloader = true;

    this.state.updateDataStore(this.client.serial, ds, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: e => {
          console.error(e);
          this.closeDialog();
        }
      });
  }

  remove(c: Record<string, any>, ds: string) {
    this.preloader = true;

    this.state.removeDataStore(this.client.serial, ds)
      .subscribe({
        next: () => {
          this.closeDialog();
        },
        error: e => {
          console.error(e);
          this.closeDialog();
        }
      });
  }
}
