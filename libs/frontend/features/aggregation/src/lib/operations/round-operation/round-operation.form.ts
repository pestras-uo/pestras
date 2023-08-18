/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, RoundOperationOptions } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-round-operation',
  templateUrl: './round-operation.form.html',
  styles: [`:host { display: block; }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: RoundOperationForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: RoundOperationForm }
  ]
})
export class RoundOperationForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("OPR");

  readonly form = this.fb.nonNullable.group({
    value: ['', [Validators.required]],
    place: [0, Validators.required]
  });

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<RoundOperationOptions>();

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
        });
      });
  }

  filterField(field: TypedEntity) {
    return ['int', 'double'].includes(field.type);
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

  writeValue(opt: RoundOperationOptions): void {
    this.form.setValue({
      value: opt?.value || '',
      place: opt?.place ?? 0
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
