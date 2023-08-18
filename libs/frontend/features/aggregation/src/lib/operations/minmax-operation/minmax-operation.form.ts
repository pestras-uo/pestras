/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, FormGroup, ControlValueAccessor, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MinmaxOperationOptions, TypedEntity } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-minmax-operation',
  templateUrl: './minmax-operation.form.html',
  styles: [`:host { display: block; }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: MinmaxOperationForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: MinmaxOperationForm }
  ]
})
export class MinmaxOperationForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("OPR");

  readonly form = new FormGroup({
    value: new FormControl<string | number>(0, { nonNullable: true, validators: Validators.required }),
    min: new FormControl<string | number>(0),
    max: new FormControl<string | number>(100)
  });

  readonly min = this.form.controls.min;
  readonly max = this.form.controls.max;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<MinmaxOperationOptions>();

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const data = this.form.getRawValue();
          const value: MinmaxOperationOptions = { value: data.value, min: null, max: null }

          if (data.min !== null)
            value.min = data.min;
          if (data.max !== null)
            value.max = data.max;

          this.onChange(value);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(value);
        });
      });
  }

  filterInputField(field: TypedEntity) {
    return ['int', 'double', 'ordinal'].includes(field.type);
  }

  filterLimitField(field: TypedEntity) {
    return ['int', 'double', 'ordinal'].includes(field.type);
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

  writeValue(opt: MinmaxOperationOptions): void {
    this.form.setValue({
      value: opt?.value || 0,
      min: opt.min ?? 0,
      max: opt.max ?? 100
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
