/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataVizGroup, Field, GroupField, GroupFieldCalc, Stats, TypeKind } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-group',
  templateUrl: './group.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: GroupForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: GroupForm }
  ]
})
export class GroupForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();

  readonly serial = Serial.gen();

  readonly form = this.fb.nonNullable.group({
    type: 'group',
    count_name: ['count', Validators.required],
    count_display_name: '',
    by: this.fb.nonNullable.array([this.fb.nonNullable.group({
      name: ['', Validators.required],
      logical: false,
      logical_name: '',
      logical_display_name: '',
      true_value: 'yes',
      false_value: 'no'
    })]),
    calc: this.fb.nonNullable.array<FormGroup<{
      field: FormControl<string>,
      method: FormControl<Stats.DescriptiveStatsProps>,
      new_name: FormControl<string>,
      display_name: FormControl<string>
    }>>([])
  });

  readonly by = this.form.controls.by;
  readonly calc = this.form.controls.calc;

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
    return ['int', 'double', 'ordinal', 'category', 'region', 'boolean'].includes(field.type)
      || (field.type === 'string' && field.kind !== TypeKind.RICH_TEXT)
  }

  filterCalcFields(field: Field) {
    return ['int', 'double'].includes(field.type) || (field.type === 'category' && field.kind === TypeKind.ORDINAL);
  }

  addGroup(group?: GroupField) {
    this.by.push(this.fb.nonNullable.group({
      name: ['', Validators.required],
      logical: [!!group?.logical, Validators.required],
      logical_name: group?.logical_name || '',
      logical_display_name: group?.logical_display_name || '',
      true_value: (group?.true_value as string) || 'yes',
      false_value: (group?.true_value as string) || 'no'
    }));
  }

  addCalc(group?: GroupFieldCalc) {
    this.calc.push(this.fb.nonNullable.group({
      field: [group?.field || '', Validators.required],
      method: this.fb.nonNullable.control<Stats.DescriptiveStatsProps>(group?.method || 'avg', Validators.required),
      new_name: [group?.new_name || '', Validators.required],
      display_name: group?.display_name || ''
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

  writeValue(options: DataVizGroup): void {
    this.form.controls.count_name.setValue(options?.count_name || 'count');
    this.form.controls.count_display_name.setValue(options?.count_display_name || '');
    this.by.clear();
    this.calc.clear();

    if (options?.by?.length)
      for (const by of options.by)
        this.addGroup(by);
    else
      this.addGroup();

    if (options?.calc?.length)
      for (const calc of options.calc)
        this.addCalc(calc);
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
