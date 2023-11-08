/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BucketStageOptions, CumulateMethod, TypedEntity, ValueModifier, IAggrPiplineStage, AggrStageTypes, TypeKind } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-bucket-stage',
  templateUrl: './bucket-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: BucketStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: BucketStageForm }
  ]
})
export class BucketStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    groupBy: this.fb.nonNullable.group({
      field: ['', Validators.required],
      modifiers: this.fb.nonNullable.control<ValueModifier[]>([])   
    }),
    buckets: [5, Validators.required],
    cumulate: this.fb.array([this.fb.nonNullable.group({
      field: ['', Validators.required],
      method: this.fb.nonNullable.control<CumulateMethod>('count', Validators.required),
      // name of field, math formula or number to count
      expr: this.fb.nonNullable.control<string | number>(1, Validators.required)
    })])
  });

  readonly groupBy = this.form.controls.groupBy;
  readonly buckets = this.form.controls.buckets;
  readonly cumulate = this.form.controls.cumulate;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<BucketStageOptions>>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          const options: IAggrPiplineStage<BucketStageOptions> = {
            type: AggrStageTypes.BUCKET,
            options: this.form.getRawValue()
          }
  
          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  filterGroupField(field: TypedEntity) {
    return !['serial', 'unknown'].includes(field.type) && field.kind !== TypeKind.RANGE;
  }

  filterField(field: TypedEntity) {
    return ['int', 'double'].includes(field.type);
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  addCumulate(options?: { field: string; method: CumulateMethod; expr: string | number; }) {
    this.cumulate.push(this.fb.nonNullable.group({
      field: [options?.field || '', Validators.required],
      method: this.fb.nonNullable.control<CumulateMethod>(options?.method || 'count', Validators.required),
      // name of field, math formula or number to count
      expr: this.fb.nonNullable.control<string | number>(options?.expr || 1, Validators.required)
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

  writeValue(opt: IAggrPiplineStage<BucketStageOptions>): void {
    this.groupBy.controls.field.setValue(opt?.options?.groupBy.field || '');
    this.groupBy.controls.modifiers.setValue(opt?.options?.groupBy.modifiers || []);

    this.buckets.setValue(opt?.options?.buckets || 5);
    
    this.cumulate.clear();
    for (const cum of (opt?.options?.cumulate || []))
      this.addCumulate(cum);
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
