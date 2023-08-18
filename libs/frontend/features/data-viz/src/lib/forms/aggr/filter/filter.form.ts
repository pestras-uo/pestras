/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataVizFilter, DataVizFilterOperator, DataVizFilters, Field, TypeKind } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: FilterForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: FilterForm }
  ]
})
export class FilterForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();

  readonly serial = Serial.gen();

  readonly form = this.fb.nonNullable.group({
    type: 'filter',
    any: false,
    filters: this.fb.nonNullable.array([this.fb.nonNullable.group({
      field: ['', Validators.required],
      operator: this.fb.nonNullable.control<DataVizFilterOperator>('eq', Validators.required),
      value: [0, Validators.required]
    })])
  });

  readonly filters = this.form.controls.filters;

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

  filterFields(field: Field) {
    return ['int', 'double', 'ordinal', 'category', 'region', 'boolean'].includes(field.type)
      || (field.type === 'string' && field.kind !== TypeKind.RICH_TEXT)
  }

  getField(name: string, fields: Field[]) {
    return fields.find(f => f.name === name);
  }

  addFilter(filter?: DataVizFilter) {
    this.filters.push(this.fb.nonNullable.group({
      field: [filter?.field || '', Validators.required],
      operator: [filter?.operator || 'eq', Validators.required],
      value: [filter?.value ?? 0, Validators.required]
    }));
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: DataVizFilters): void {
    this.form.controls.any.setValue(options?.any ?? false);
    this.filters.clear();

    if (options?.filters?.length)
      for (const filter of options.filters)
        this.addFilter(filter);
    else
      this.addFilter();
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
