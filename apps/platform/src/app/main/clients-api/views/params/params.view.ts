/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientApiState } from '@pestras/frontend/state';
import { ClientApi, ClientApiDataStore, ClientApiDataStoreParam, ClientApiDataStoreParamOperators, DataStore, Field } from '@pestras/shared/data-model';

@Component({
  selector: 'app-params',
  templateUrl: './params.view.html',
  styles: [
  ]
})
export class ParamsView {

  readonly form = this.fb.nonNullable.group({
    required: false,
    field: ['', Validators.required],
    operator: this.fb.nonNullable.control<ClientApiDataStoreParamOperators>('eq', Validators.required),
    alias: '',
    default: this.fb.control<any>(null)
  });

  preloader = false;
  dialogRef: DialogRef | null = null;


  @Input({ required: true })
  client!: ClientApi;
  @Input({ required: true })
  options!: ClientApiDataStore;
  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private state: ClientApiState,
    private fb: FormBuilder,
    private dialog: Dialog
  ) { }

  openModal(tmp: TemplateRef<any>, param?: ClientApiDataStoreParam) {
    if (param) {
      this.form.controls.required.setValue(param.required);
      this.form.controls.field.setValue(param.field);
      this.form.controls.operator.setValue(param.operator);
      this.form.controls.alias.setValue(param.alias || '');
      this.form.controls.default.setValue(param.default);
    }

    this.dialogRef = this.dialog.open(tmp, { data: param });
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }

    this.preloader = false;
    this.form.reset();
  }

  submit(param: string) {
    param ? this.update(param) : this.add();
  }

  findOperator(operator: string, c: Record<string, any>, ) {
    return c['dataVizFilterOperators'].find((o: any) => o.value === operator)?.name;
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  findField(name: string, fields: Field[]) {
    return fields.find(f => f.name === name)?.display_name;
  }

  add() {
    this.preloader = true;

    this.state.addParam(this.client.serial, this.options.serial, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.closeModal();
        },
        error: e => {
          console.error(e);
          this.closeModal();
        }
      });
  }

  update(param: string) {
    this.preloader = true;

    this.state.updateParam(this.client.serial, this.options.serial, param, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.closeModal();
        },
        error: e => {
          console.error(e);
          this.closeModal();
        }
      });
  }

  remove(param: string) {
    this.preloader = true;

    this.state.removeParam(this.client.serial, this.options.serial, param)
      .subscribe({
        next: () => {
          this.closeModal();
        },
        error: e => {
          console.error(e);
          this.closeModal();
        }
      });
  }
}
