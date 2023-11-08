/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Field, HierarchicalDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-hierarchical-chart-form',
  templateUrl: './hierarchical.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: HierarchicalForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: HierarchicalForm }
  ]
})
export class HierarchicalForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();

  readonly id = Serial.gen("FRM");
  readonly form = this.fb.nonNullable.group({
    name_field: ['', Validators.required],
    color_range: this.fb.nonNullable.array([
      this.fb.nonNullable.control('#44FF66'),
      this.fb.nonNullable.control('#FF4466'),
    ]),
    size_field: ['', Validators.required]
  });

  readonly colorRange = this.form.controls.color_range;

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

  filterNameField(field: Field) {
    return field.type === 'string' && field.kind === TypeKind.NONE;
  }

  filterValueField(field: Field) {
    return ['int', 'double'].includes(field.type) || (field.type === 'category' && field.kind !== TypeKind.NONE);
  }

  addColor(color?: string) {
    this.colorRange.push(this.fb.nonNullable.control(color ?? '#4466FF'))
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: HierarchicalDataVizOptions): void {
    this.form.controls.name_field.setValue(options?.name_field || '');
    this.form.controls.size_field.setValue(options?.size_field || '');

    this.colorRange.clear();

    if (options?.color_range?.length) {
      for (const color of options.color_range)
        this.addColor(color);

    } else {
      this.addColor('#44FF66');
      this.addColor('#FF4466');
    }
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
