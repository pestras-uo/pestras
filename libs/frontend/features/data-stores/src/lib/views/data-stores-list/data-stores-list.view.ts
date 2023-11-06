/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { Blueprint, DataStore, DataStoreType } from '@pestras/shared/data-model';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ToastService } from '@pestras/frontend/ui';
import { Observable, map } from 'rxjs';
import { DataStoresState } from '@pestras/frontend/state';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-stores-list',
  templateUrl: './data-stores-list.view.html',
  styles: [
  ]
})
export class DataStoresListView implements OnChanges {

  readonly form = this.fb.nonNullable.group({
    blueprint: '',
    type: this.fb.nonNullable.control<DataStoreType>(DataStoreType.TABLE, { validators: Validators.required }),
    name: ['', Validators.required]
  });

  datastores$!: Observable<DataStore[]>;

  dialogRef: DialogRef | null = null;
  preloader = false;

  @Input({ required: true })
  blueprint!: Blueprint;
  @Input()
  type: DataStoreType | null = null;
  @Input()
  static = false;
  @Input()
  title?: string;
  @Input()
  editable = false;
  
  constructor(
    private state: DataStoresState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnChanges(): void {
    this.type && this.form.controls.type.setValue(this.type);

    this.datastores$ = this.state.selectGroup(this.blueprint.serial)
      .pipe(map(list => list.filter(ds => {
        if (this.type && ds.type !== this.type)
          return false;

        if (!this.static && ds.settings?.static)
          return false;

        return true;
      })));
  }

  openDialog(tmp: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.preloader = false;

    this.form.reset();
  }

  add(c: Record<string, any>) {
    this.preloader = true;
    
    this.form.controls.blueprint.setValue(this.blueprint.serial);

    this.state.create(this.form.getRawValue())
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
