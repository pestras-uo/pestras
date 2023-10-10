/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataStore, DataVizTypes, Field, TypeKind } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { DataVizState } from '@pestras/frontend/state';
import { untilDestroyed } from '@pestras/frontend/ui';
import { distinctUntilChanged } from 'rxjs';

let count = 0;

@Component({
  selector: 'app-chart-form',
  templateUrl: './chart.form.html'
})
export class ChartForm implements OnInit {
  count = count++;

  private ud = untilDestroyed();

  readonly form = this.fb.nonNullable.group({
    data_store: ['', Validators.required],
    aggregate: this.fb.nonNullable.control<any[]>([]),
    type: this.fb.nonNullable.control<DataVizTypes>(DataVizTypes.PIE, Validators.required),
    options: this.fb.nonNullable.control<any>(null)
  });

  readonly dataStore = this.form.controls.data_store;
  readonly type = this.form.controls.type;

  preloader = false
  fields: Field[] = [];

  @Input()
  fcClass = '';
  @Input()
  blueprint: string | null = null;

  @Output()
  done = new EventEmitter<string | null>();

  constructor(
    private fb: FormBuilder,
    private state: DataVizState,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.form.controls.type.valueChanges
      .pipe(
        this.ud(),
        distinctUntilChanged()
      )
      .subscribe(() => this.form.controls.options.setValue(null));
  }

  cancel() {
    this.done.emit(null);
  }

  fieldsChange(fields: Field[]) {
    this.fields = fields;
  }

  filterFields(field: Field) {
    return ['int', 'double', 'boolean', 'ordinal', 'category', 'region'].includes(field.type)
      || (field.type === 'string' && field.kind === TypeKind.NONE);
  }

  mapFields(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  getField(name: string, dataStore: DataStore) {
    return dataStore.fields.find(f => f.name === name);
  }

  submit(c: Record<string, any>) {
    this.preloader = true;

    this.state.create(this.form.getRawValue())
      .subscribe({
        next: dataViz => {
          this.done.emit(dataViz.serial);
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
