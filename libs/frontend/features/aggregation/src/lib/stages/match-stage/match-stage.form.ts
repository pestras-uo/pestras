/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors, ControlValueAccessor, FormBuilder, Validators } from '@angular/forms';
import { TypedEntity, IAggrPiplineStage, MatchStageOptions, AggrStageTypes, ValueModifier, FilterCompareOperator, FilterOptions } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-match-stage',
  templateUrl: './match-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: MatchStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: MatchStageForm }
  ]
})
export class MatchStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("OPR");

  readonly form = this.fb.nonNullable.group({
    filters: this.fb.nonNullable.array([
      this.fb.nonNullable.group({
        group: ['', Validators.required],
        field: ['', Validators.required],
        field_modifiers: this.fb.nonNullable.control<ValueModifier[]>(['floor'], Validators.required),
        operator: this.fb.nonNullable.control<FilterCompareOperator>('$eq', Validators.required),
        value_from_field: this.fb.nonNullable.control(false, Validators.required),
        value: this.fb.nonNullable.control<any>(0, Validators.required),
        value_modifiers: this.fb.nonNullable.control<ValueModifier[]>(['floor'], Validators.required)
      })
    ])
  });

  readonly filters = this.form.controls.filters;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<MatchStageOptions>>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const options: IAggrPiplineStage<MatchStageOptions> = {
            type: AggrStageTypes.MATCH,
            options: this.form.getRawValue()
          }

          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  operatorChange(i: number) {
    const operator = this.filters.controls[i].controls.operator.value;
    
    if (operator === '$in' || operator === '$nin') {
      this.filters.controls[i].controls.value_from_field.setValue(false);
      this.filters.controls[i].controls.value.setValue([]);
    }
  }

  filterField(field: TypedEntity) {
    return !['unkown', 'serial'].includes(field.type);
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  addFilter(filter?: FilterOptions) {
    const group = this.fb.nonNullable.group({
      group: [filter?.group || '', Validators.required],
      field: [filter?.field || '', Validators.required],
      field_modifiers: this.fb.nonNullable.control<ValueModifier[]>(filter?.field_modifiers || ['string'], Validators.required),
      operator: this.fb.nonNullable.control<FilterCompareOperator>(filter?.operator || '$eq', Validators.required),
      value_from_field: this.fb.nonNullable.control(filter?.value_from_field ?? false, Validators.required),
      value: this.fb.nonNullable.control<any>(filter?.value ?? 0, Validators.required),
      value_modifiers: this.fb.nonNullable.control<ValueModifier[]>(filter?.value_modifiers ?? ['floor'], Validators.required)
    });

    this.filters.push(group as any);
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: IAggrPiplineStage<MatchStageOptions>): void {
    this.filters.clear();

    for (const filter of (opt?.options?.filters || []))
      this.addFilter(filter);
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
