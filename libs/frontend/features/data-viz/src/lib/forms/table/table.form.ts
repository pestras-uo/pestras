/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Field, TableDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-table-form',
  templateUrl: './table.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: TableForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: TableForm }
  ]
})
export class TableForm implements OnInit {
  private ud = untilDestroyed();

  readonly form = this.fb.nonNullable.group({
    pagination: [20, Validators.required],
    indicator: this.fb.nonNullable.group({
      field: ['', Validators.required],
      levels: this.fb.nonNullable.group({
        orange: [33.33, Validators.required],
        red: [66.66, Validators.required],
        blink: this.fb.control<number | null | undefined>(null)
      })
    })
  });

  readonly indicator = this.fb.nonNullable.control(false);
  readonly levels = this.form.controls.indicator.controls.levels;

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

          this.onChange(this.indicator.value ? value : { indicator: null });
          !this.touched && (this.touched = true) && this.onTouched();
        });
      });
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
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

  writeValue(options: TableDataVizOptions): void {
    this.form.controls.pagination.setValue(options?.pagination || 20);

    if (options?.indicator) {
      this.form.controls.indicator.controls.field.setValue(options.indicator.field ?? '');
      this.levels.controls.orange.setValue(options.indicator.levels.orange);
      this.levels.controls.red.setValue(options.indicator.levels.red);
      this.levels.controls.blink.setValue(options.indicator.levels.blink ?? null);
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
