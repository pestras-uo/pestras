/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Field, TimelineDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-timeline-chart-form',
  templateUrl: './timeline.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: TimelineForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: TimelineForm }
  ]
})
export class TimelineForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();
  
  readonly form = this.fb.nonNullable.group({
    category_field: ['', Validators.required],
    start_field: ['', Validators.required],
    end_field: ['', Validators.required],
    indicator: ''
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

  filterDateField(field: Field) {
    return field.type === 'date' || field.type === 'datetime';
  }

  filterNumericField(field: Field) {
    return field.type === 'int'
      || field.type === 'double'
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: TimelineDataVizOptions): void {
    this.form.controls.category_field.setValue(options?.category_field || '');
    this.form.controls.start_field.setValue(options?.start_field || '');
    this.form.controls.end_field.setValue(options?.end_field || '');
    this.form.controls.indicator.setValue(options?.indicator || '');
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
