/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Field, RadarDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-radar-chart-form',
  templateUrl: './radar.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: RadarForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: RadarForm }
  ]
})
export class RadarForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();
  
  readonly form = this.fb.nonNullable.group({
    category_field: ['', Validators.required],
    value_fields: this.fb.nonNullable.control<string[]>([], Validators.required),
  });

  disabled = false;
  touched = false;

  @Input({ required: true })
  dsFields!: Field[];
  @Input()
  fcClass = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const value = this.form.getRawValue();
  
          this.onChange(value);
          !this.touched && (this.touched = true) && this.onTouched();
        });
      });
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  filterCatField(field: Field) {
    return !['serial', 'unknown', 'string'].includes(field.type)
      || (field.type === 'string' && field.kind === TypeKind.NONE);
  }

  filterValueField(field: Field) {
    return ['int', 'double', 'ordinal'].includes(field.type);
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: RadarDataVizOptions): void {
    this.form.controls.category_field.setValue(options?.category_field || '');
    this.form.controls.value_fields.setValue(options?.value_fields || []);
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
