/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataStoresState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
import { DataStore, DateUnit, QueryOptionUse, WSQueryOptions } from '@pestras/shared/data-model';

@Component({
  selector: 'app-params',
  templateUrl: './params.view.html',
  styles: [
  ]
})
export class ParamsView implements OnChanges {

  readonly form = this.fb.nonNullable.group({
    key: ['', Validators.required],
    value: ['', Validators.required],
    date_format: [''],
    add_to_date: this.fb.nonNullable.array([
      this.fb.nonNullable.group({ unit: 'year' as DateUnit, amount: [0, Validators.required] }),
      this.fb.nonNullable.group({ unit: 'month' as DateUnit, amount: [0, Validators.required] }),
      this.fb.nonNullable.group({ unit: 'day' as DateUnit, amount: [0, Validators.required] })
    ]),
    dest: this.fb.nonNullable.control<'body' | 'search' | 'path'>('search', Validators.required),
    use: this.fb.nonNullable.control<QueryOptionUse>(QueryOptionUse.ALWAYES, Validators.required)
  });

  callDate = new FormControl(false, { nonNullable: true });
  add_to_date = this.form.controls.add_to_date;
  addForm = false;
  preloader = false;
  params: WSQueryOptions[] = [];

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
    this.params = this.dataStore.web_service?.payload ?? [];
  }

  findUsage(use: { name: string; value: QueryOptionUse }, value: QueryOptionUse) {
    return use.value === value;
  }

  findDest(use: { name: string; value: 'body' | 'search' | 'path' }, value: 'body' | 'search' | 'path') {
    return use.value === value;
  }

  findDataUnit(opt: { unit: DateUnit }, unit: DateUnit) {
    return opt.unit === unit;
  }

  callDateChange() {
    const checked = this.callDate.value;

    if (checked) {
      this.form.controls.value.setValue('$$NOW');
    } else {
      this.form.controls.value.setValue('');
      this.form.controls.date_format.setValue('');
      this.form.controls.add_to_date.setValue([
        { unit: 'year', amount: 0 },
        { unit: 'month', amount: 0 },
        { unit: 'day', amount: 0 }
      ]);
    }
  }

  add(c: Record<string, any>) {
    this.preloader = true;

    this.state.addWebServiceParam(this.dataStore.serial, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.form.reset();
          this.callDate.setValue(false);
          this.preloader = false;

        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  remove(c: Record<string, any>, serial: string) {
    this.state.removeWebServiceParam(this.dataStore.serial, serial)
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
