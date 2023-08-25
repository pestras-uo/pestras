/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Field, TypesNames, modifiersOutoutTypeMap } from '@pestras/shared/data-model';
import { ToastService } from '@pestras/frontend/ui';
import { DataStoresState } from '@pestras/frontend/state';
import { ConstraintFormModal } from './form.model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-field-constraint',
  templateUrl: './field-constraint.modal.html',
  styles: [
  ]
})
export class FieldConstraintModal implements OnInit {
  private ud = untilDestroyed();

  values: FormControl<any>[] | null = null;
  type!: TypesNames

  readonly form = new FormGroup<ConstraintFormModal>({
    values: new FormControl([], { nonNullable: true }),
    modifiers: new FormControl(['int', 'string', 'double'], { nonNullable: true }),
    inverse: new FormControl(false, { nonNullable: true })
  });

  preloader = false;

  @Input({ required: true })
  dataStore!: string;
  @Input({ required: true })
  field!: Field;

  @Output()
  closes = new EventEmitter();

  constructor(
    private state: DataStoresState,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.type = this.field.type;

    if (this.field.constraint) {
      this.field.constraint.modifiers.length && this.form.controls.modifiers.setValue(this.field.constraint.modifiers ?? [])
      this.form.controls.inverse.setValue(this.field.constraint.inverse);

      if (this.field.constraint.modifiers.length)
        this.type = modifiersOutoutTypeMap[this.field.constraint.modifiers.slice(-1)[0]];
    }

    this.resetValues(this.field.constraint?.values);

    this.form.controls.modifiers.valueChanges
      .pipe(this.ud())
      .subscribe(modifiers => {
        this.type = modifiers.length ? modifiersOutoutTypeMap[modifiers.slice(-1)[0]] : this.field.type;
        this.resetValues();
      });
  }

  resetValues(values?: any[]) {
    switch (this.type) {
      case 'boolean':
        this.values = [new FormControl<boolean>(!!values?.[0])]
        break;
      case 'category':
      case 'region':
        this.values = [new FormControl<string[]>(values?.[0] ?? [])]
        break;
      case 'date':
      case 'datetime':
        this.values = [new FormControl<Date | null>(values?.[0] ?? null), new FormControl<Date | null>(values?.[1] ?? null)];
        break;
      case 'int':
      case 'double':
        this.values = [new FormControl<number | null>(values?.[0] ?? null), new FormControl<number | null>(values?.[1] ?? null)];
        break;
      case 'string':
        this.values = [new FormControl<string>(values?.[0] ?? '')];
        break;
      default:
        this.values = null;
    }
  }

  clear(c: Record<string, any>) {
    this.preloader = true;

    this.state.removeFieldConstraint(this.dataStore, this.field.name)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closes.emit();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }

  submit(c: Record<string, any>) {
    this.preloader = true;

    if (!this.values?.length || this.values.every(c => (c.value ?? null) === null))
      return this.clear(c);

    this.form.controls.values.setValue(this.values?.map(v => v.value) ?? null);

    this.state.setFieldConstraint(this.dataStore, this.field.name, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closes.emit();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.preloader = false;
        }
      });
  }
}
