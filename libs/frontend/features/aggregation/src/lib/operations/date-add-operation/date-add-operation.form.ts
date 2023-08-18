/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DateAddOperationOptions, TypedEntity, DateUnit } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-date-add-operation',
  templateUrl: './date-add-operation.form.html',
  styles: [`:host { display: block; }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: DateAddOperationForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: DateAddOperationForm }
  ]
})
export class DateAddOperationForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("OPR");

  readonly form = this.fb.nonNullable.group({
    // select from fields list
    field: ['', Validators.required],
    // select target type
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  });

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<DateAddOperationOptions>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          const value = this.form.getRawValue();
          const output: DateAddOperationOptions = { field: value.field, amount: [] };
          const values: { unit: DateUnit; value: number; }[] = [];

          value.year && values.push({ unit: 'year', value: value.year });
          value.month && values.push({ unit: 'month', value: value.month });
          value.day && values.push({ unit: 'day', value: value.day });
          value.hour && values.push({ unit: 'hour', value: value.hour });
          value.minute && values.push({ unit: 'minute', value: value.minute });
          value.second && values.push({ unit: 'second', value: value.second });

          output.amount.push(...values);

          this.onChange(v);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(output);
        });
      });
  }

  filterField(field: TypedEntity) {
    return field.type === 'date' || field.type === 'datetime'
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: DateAddOperationOptions): void {
    this.form.setValue({
      field: opt?.field || '',
      year: opt?.amount?.find(a => a.unit === 'year')?.value || 0,
      month: opt?.amount?.find(a => a.unit === 'month')?.value || 0,
      day: opt?.amount?.find(a => a.unit === 'day')?.value || 0,
      hour: opt?.amount?.find(a => a.unit === 'hour')?.value || 0,
      minute: opt?.amount?.find(a => a.unit === 'minute')?.value || 0,
      second: opt?.amount?.find(a => a.unit === 'second')?.value || 0
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return null;
  }
}
