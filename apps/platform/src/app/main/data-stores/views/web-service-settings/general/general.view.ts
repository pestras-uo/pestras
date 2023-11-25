/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { ToastService, untilDestroyed } from '@pestras/frontend/ui';
import { DataStore, Interval, WSAccept, WSContentType } from '@pestras/shared/data-model';
import { WebServiceConfigModel, WebServicePaginationModel } from './form.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.view.html',
  styles: [
  ]
})
export class GeneralView implements OnInit {
  private ud = untilDestroyed();

  readonly paginationOn = new FormControl<boolean>(false, { nonNullable: true });

  readonly form = new FormGroup<WebServiceConfigModel>({
    resource_uri: new FormControl('', { nonNullable: true, validators: Validators.required }),
    method: new FormControl('get', { nonNullable: true, validators: Validators.required }),
    make_init_request: new FormControl(false, { nonNullable: true }),
    replace_existing: new FormControl(false, { nonNullable: true }),
    content_type: new FormControl(WSContentType.JSON, { nonNullable: true, validators: Validators.required }),
    accept: new FormControl(WSAccept.JSON, { nonNullable: true, validators: Validators.required }),
    data_path: new FormControl('', { nonNullable: true, validators: Validators.required }),
    intervals: new FormControl(Interval.NONE, { nonNullable: true, validators: Validators.required }),
    fetch_day: new FormControl(1, { nonNullable: true, validators: Validators.required }),
    pagination: new FormGroup<WebServicePaginationModel>({
      skip: new FormControl("skip", { nonNullable: true }),
      limit: new FormControl("limit", { nonNullable: true }),
    })
  });

  readonly interval = this.form.controls.intervals;
  readonly pagination = this.form.controls.pagination;

  preloader = false;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  constructor(
    private state: DataStoresState,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.interval.valueChanges
      .pipe(this.ud())
      .subscribe(i => {
        if (i !== Interval.ON_DEMAND)
          this.paginationOn.setValue(false);
      });

    this.paginationOn.valueChanges
      .pipe(this.ud())
      .subscribe(on => {
        if (on) {
          this.pagination.controls.skip.setValidators(Validators.required);
          this.pagination.controls.limit.setValidators(Validators.required);
        } else {
          this.pagination.controls.skip.removeValidators(Validators.required);
          this.pagination.controls.limit.setValidators(Validators.required);
        }

        this.pagination.controls.skip.updateValueAndValidity()
        this.pagination.controls.limit.updateValueAndValidity()
      });

    if (this.dataStore.web_service) {
      this.form.controls.resource_uri.setValue(this.dataStore.web_service.resource_uri);
      this.form.controls.method.setValue(this.dataStore.web_service.method);
      this.form.controls.make_init_request.setValue(this.dataStore.web_service.make_init_request);
      this.form.controls.replace_existing.setValue(this.dataStore.web_service.replace_existing);
      this.form.controls.content_type.setValue(this.dataStore.web_service.content_type);
      this.form.controls.accept.setValue(this.dataStore.web_service.accept);
      this.form.controls.data_path.setValue(this.dataStore.web_service.data_path ?? '');
      this.form.controls.intervals.setValue(this.dataStore.web_service.intervals);
      this.form.controls.fetch_day.setValue(this.dataStore.web_service.fetch_day);
      this.form.controls.pagination.setValue(this.dataStore.web_service.pagination ?? { skip: 'skip', limit: 'limit' });
    }

    this.interval.valueChanges
      .pipe(this.ud())
      .subscribe(i => {
        if (i !== Interval.ON_DEMAND)
          this.paginationOn.setValue(false);
      });

    this.paginationOn.valueChanges
      .pipe(this.ud())
      .subscribe(on => {
        if (on) {
          this.pagination.controls.skip.setValidators(Validators.required);
          this.pagination.controls.limit.setValidators(Validators.required);
        } else {
          this.pagination.controls.skip.removeValidators(Validators.required);
          this.pagination.controls.limit.setValidators(Validators.required);
        }

        this.pagination.controls.skip.updateValueAndValidity()
        this.pagination.controls.limit.updateValueAndValidity()
      });
  }

  update(c: Record<string, any>) {
    this.preloader = true;

    const data: any = this.form.getRawValue();

    if (data.intervals !== Interval.ON_DEMAND)
      data.pagination = null;

    this.state.setWebServiceSettings(this.dataStore.serial, data)
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
