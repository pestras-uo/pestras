/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataVizSort, DataVizSortField, Field, TypeKind } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SortForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: SortForm }
  ]
})
export class SortForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();

  readonly serial = Serial.gen();

  readonly form = this.fb.nonNullable.group({
    type: 'sort',
    fields: this.fb.nonNullable.array([this.fb.nonNullable.group({
      name: ['', Validators.required],
      desc: false
    })])
  });

  readonly sortFields = this.form.controls.fields

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

  addSort(sort?: DataVizSortField) {
    this.sortFields.push(this.fb.nonNullable.group({
      name: [sort?.name || '', Validators.required],
      desc: !!sort?.desc
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

  writeValue(options: DataVizSort): void {
    this.sortFields.clear();

    if (options?.fields?.length)
      for (const sortField of options.fields)
        this.addSort(sortField);
    else
      this.addSort();
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
