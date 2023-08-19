/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { FormValidators, ToastService } from '@pestras/frontend/ui';
import { DataStore, Interval, WSAccept, WSContentType } from '@pestras/shared/data-model';
import { objUtil } from '@pestras/shared/util';

@Component({
  selector: 'app-general',
  templateUrl: './general.view.html',
  styles: [
  ]
})
export class GeneralView implements OnInit {

  readonly form = this.fb.nonNullable.group({
    resource_uri: ['', Validators.required],
    method: this.fb.nonNullable.control<'get' | 'post'>('get', Validators.required),
    make_init_request: [false],
    replace_existing: [false],
    content_type: this.fb.nonNullable.control<WSContentType>(WSContentType.JSON, Validators.required),
    accept: this.fb.nonNullable.control<WSAccept>(WSAccept.JSON, Validators.required),
    data_path: [''],
    intervals: this.fb.nonNullable.control<Interval>(Interval.MONTHLY),
    fetch_day: [1, [Validators.required, Validators.min(1), Validators.max(28)]]
  });

  preloader = false;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private state: DataStoresState,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit() {
    if (this.dataStore.web_service) {
      const state = objUtil.omit(this.dataStore.web_service, ['auth', 'selection', 'headers', 'initialized', 'payload']);
  
      this.form.setValue(state as any);
      setTimeout(() => this.form.setValidators(FormValidators.changed(state)));
    }
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    this.state.setWebServiceSettings(this.dataStore.serial, this.form.getRawValue())
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
