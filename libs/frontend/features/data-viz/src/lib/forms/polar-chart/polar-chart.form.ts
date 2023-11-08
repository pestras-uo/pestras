/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Field, PolarDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-polar-chart-form',
  templateUrl: './polar-chart.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: PolarChartForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: PolarChartForm }
  ]
})
export class PolarChartForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  readonly form = this.fb.nonNullable.group({
    value_field: ['', Validators.required],
    category_field: ['', Validators.required],
    indicator: false,
    reverse_indicator: false
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
    return !['serial', 'unknown'].includes(field.type)
      && ![TypeKind.RICH_TEXT, TypeKind.RANGE].includes(field.kind);
  }

  filterValueField(field: Field) {
    return ['int', 'double'].includes(field.type) || (field.type === 'category' && field.kind !== TypeKind.NONE);
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: PolarDataVizOptions): void {
    this.form.controls.category_field.setValue(options?.category_field || '');
    this.form.controls.value_field.setValue(options?.value_field || '');
    this.form.controls.indicator.setValue(options?.indicator ?? false);
    this.form.controls.reverse_indicator.setValue(options?.reverse_indicator ?? false);
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
