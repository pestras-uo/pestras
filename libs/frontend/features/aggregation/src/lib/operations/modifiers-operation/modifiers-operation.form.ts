/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, FormGroup, ControlValueAccessor, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ModifiersOperationOptions, TypedEntity, ValueModifier } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-modifiers-operation',
  templateUrl: './modifiers-operation.form.html',
  styles: [`:host { display: block; }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ModifiersOperationForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: ModifiersOperationForm }
  ]
})
export class ModifiersOperationForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("OPR");

  readonly form = new FormGroup({
    value: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    modifiers: new FormControl<ValueModifier[]>(['floor'], { nonNullable: true, validators: Validators.required })
  });

  value = this.form.controls.value;
  modifiers = this.form.controls.modifiers;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<ModifiersOperationOptions>();

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const value = this.form.getRawValue();

          this.onChange(value);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(value);
        });
      });
  }

  filterField(field: TypedEntity) {
    return !['unknown', 'serial'].includes(field.type);
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

  writeValue(opt: ModifiersOperationOptions): void {
    this.form.setValue({
      value: opt?.value || '',
      modifiers: opt?.modifiers || ['int']
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
