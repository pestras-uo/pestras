/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataStore, DataStoreState, DataStoreType, Field } from '@pestras/shared/data-model';


@Component({
  selector: 'app-data-store-fields-list',
  templateUrl: './fields-list.view.html',
  styles: [`
    :host {
      display: block;
      padding: 40px;
    }
  `]
})
export class FieldsListView implements OnInit {
  private dialogRef: DialogRef | null = null;

  readonly system = new FormControl(false);
  readonly updateForm = this.fb.nonNullable.group({
    display_name: ['', Validators.required],
    group: [''],
    desc: ['']
  });

  activeField: Field | null = null;
  form = false;
  preloader = false;
  isBuild!: boolean;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private state: DataStoresState,
    private fb: FormBuilder,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.isBuild = this.dataStore.state === DataStoreState.BUILD;
  }

  filterFields(field: Field, isSystem: boolean) {
    return isSystem ? true : !field.system;
  }

  editForm(tmp: TemplateRef<any>, field: Field) {
    if (this.dataStore.type === DataStoreType.TABLE) {
      this.activeField = field;
      this.form = true;

    } else {
      this.updateForm.controls.display_name.setValue(field.display_name);
      this.updateForm.controls.group.setValue(field.group || '');
      this.updateForm.controls.desc.setValue(field.desc || '');
      this.dialogRef = this.dialog.open(tmp, { data: field });
    }
  }

  closeForm() {
    this.activeField = null;
    this.form = false;
    this.updateForm.reset();

    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  update(c: Record<string, any>, field: string) {
    this.preloader = true;

    this.state.updateField(this.dataStore.serial, field, this.updateForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
          this.closeForm();
          this.preloader = false;
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  remove(c: Record<string, any>, field: string) {
    this.preloader = true;

    this.state.removeField(this.dataStore.serial, field)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].orgunitAdd, { type: 'success' });
          this.closeForm();
          this.preloader = false;
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
