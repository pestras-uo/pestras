/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataVizTranspose, Field, Stats, TypeKind } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-transpose',
  templateUrl: './transpose.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: TransposeForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: TransposeForm }
  ]
})
export class TransposeForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();

  readonly serial = Serial.gen();

  readonly form = this.fb.nonNullable.group({
    type: 'transpose',
    name: ['', Validators.required],
    logical: false,
    target: ['', Validators.required],
    method: this.fb.nonNullable.control<Stats.DescriptiveStatsProps>('avg', Validators.required),
    true_value: 'yes',
    false_value: 'no'
  });

  disabled = false;
  touched = false;

  @Input({ required: true })
  fields!: Field[];
  @Input()
  fcClass = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          
          if (!this.form.valid)
            return;
            
          const value = this.form.getRawValue();
  
          this.onChange(value);
          !this.touched && this.onTouched();
          this.touched = true;
        });
      });
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  filterGroupFields(field: Field) {
    return ['int', 'double', 'boolean', 'ordinal', 'category', 'region'].includes(field.type)
      || (field.type === 'string' && field.kind === TypeKind.NONE)
  }

  filterCalcFields(field: Field) {
    return ['int', 'double'].includes(field.type)
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: DataVizTranspose): void {
    this.form.controls.name.setValue(options?.name || '');
    this.form.controls.logical.setValue(!!options?.logical);
    this.form.controls.target.setValue(options?.target || '');
    this.form.controls.method.setValue(options?.method || 'avg');
    this.form.controls.true_value.setValue(options?.true_value || 'yes');
    this.form.controls.false_value.setValue(options?.false_value || 'no');
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
