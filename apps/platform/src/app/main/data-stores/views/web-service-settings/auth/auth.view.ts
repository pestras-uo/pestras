/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { FormValidators, ToastService } from '@pestras/frontend/ui';
import { DataStore } from '@pestras/shared/data-model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.view.html',
  styles: [
  ]
})
export class AuthView implements OnChanges {

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  preloader = false;
  hasAuth = false;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private state: DataStoresState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnChanges() {
    const state = this.dataStore.web_service?.auth || { username: '', password: '' };
    this.hasAuth = !!state.username && !!state.password;
    this.form.setValue(state);
    this.form.setValidators(FormValidators.changed(state));
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.setWebServiceAuth(this.dataStore.serial, this.form.getRawValue())
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

  clear(c: Record<string, any>) {
    this.preloader = true;

    this.state.removeWebServiceAuth(this.dataStore.serial)
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
