/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataStore } from '@pestras/shared/data-model';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.view.html',
})
export class HeadersView implements OnChanges {

  readonly form = this.fb.nonNullable.group({
    key: ['', Validators.required],
    value: ['', Validators.required]
  });

  preloader = false;
  headers: { key: string; value: string; }[] = [];

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
    this.headers = this.dataStore.web_service?.headers ?? [];
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.setWebServiceHeader(this.dataStore.serial, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.form.reset();
          this.preloader = false;

        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  update(c: Record<string, any>, key: string, value: string) {
    this.preloader = true;

    this.state.setWebServiceHeader(this.dataStore.serial, { key, value })
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

  remove(c: Record<string, any>, key: string) {
    this.preloader = true;

    this.state.removeWebServiceHeader(this.dataStore.serial, key)
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
