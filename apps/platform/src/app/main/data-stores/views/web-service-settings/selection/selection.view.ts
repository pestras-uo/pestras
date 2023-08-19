/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { CastModifer, DataStore, WebServiceSelection } from '@pestras/shared/data-model';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.view.html',
  styles: [
  ]
})
export class SelectionView implements OnChanges {

  readonly form = this.fb.nonNullable.group({
    field: ['', Validators.required],
    as: this.fb.nonNullable.control<string>(''),
    display_name: ['', Validators.required],
    type: this.fb.nonNullable.control<CastModifer>('string', Validators.required),
    onError: this.fb.nonNullable.control<any>('', Validators.required),
    onNull: this.fb.nonNullable.control<any>('')
  });

  preloader = false;
  selection: WebServiceSelection[] = [];

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private state: DataStoresState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnChanges(): void {
    this.selection = this.dataStore.web_service?.selection ?? [];
  }

  findType(type: { name: string; value: string; }, value: string) {
    return type.value === value;
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.addWebServiceSelection(this.dataStore.serial, this.form.getRawValue())
    .subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
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
    this.state.removeWebServiceSelection(this.dataStore.serial, field)
    .subscribe({
      next: () => {
        this.toast.msg(c['success'].default, { type: 'success' });
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
