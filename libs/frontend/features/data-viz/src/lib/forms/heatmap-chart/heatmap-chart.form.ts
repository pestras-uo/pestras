/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HeatmapDataVizOptions } from '@pestras/shared/data-model';
import { Field, TypeKind } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-heatmap-chart-form', // Change the selector
  templateUrl: './heatmap-chart.form.html', // Create a new template
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: HeatmapForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: HeatmapForm },
  ],
})
export class HeatmapForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  readonly form = this.fb.nonNullable.group({
    value_field: ['', Validators.required], // Change to a single value field
    row_field: ['', Validators.required], // Add row field
    column_field: ['', Validators.required], // Add column field
  });

  disabled = false;
  touched = false;

  @Input({ required: true })
  dsFields!: Field[];
  @Input()
  fcClass = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(this.ud()).subscribe(() => {
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
    return (
      !['serial', 'unknown'].includes(field.type) &&
      ![TypeKind.RICH_TEXT, TypeKind.RANGE].includes(field.kind)
    );
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: HeatmapDataVizOptions): void {
    this.form.controls.value_field.setValue(options?.value_field || '');
    this.form.controls.row_field.setValue(options?.row_field || '');
    this.form.controls.column_field.setValue(options?.column_field || '');
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
