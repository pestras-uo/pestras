/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DateDiffOperationOptions, DateUnit, TypedEntity } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-date-diff-operation',
  templateUrl: './date-diff-operation.form.html',
  styles: [`:host { display: block; }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: DateDiffOperationForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: DateDiffOperationForm }
  ]
})
export class DateDiffOperationForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("OPR");

  readonly form = this.fb.nonNullable.group({
    unit: this.fb.nonNullable.control<DateUnit>('year', Validators.required),
    from: ['', Validators.required],
    to: ['', Validators.required],
    unit_name: ['', Validators.required]
  });

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<DateDiffOperationOptions>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          this.onChange(v);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(this.form.getRawValue());
        })
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

  writeValue(opt: DateDiffOperationOptions): void {
    this.form.setValue({
      unit: opt?.unit || 'year',
      from: opt?.from || '',
      to: opt?.to || '',
      unit_name: opt?.unit_name || ''
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
