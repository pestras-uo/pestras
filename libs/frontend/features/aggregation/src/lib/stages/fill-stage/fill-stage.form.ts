/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { FillStageOptions, TypedEntity, ValueModifier, IAggrPiplineStage, AggrStageTypes } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-fill-stage',
  templateUrl: './fill-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: FillStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: FillStageForm }
  ]
})
export class FillStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.group({
    sortBy: this.fb.nonNullable.group({
      field: ['', Validators.required],
      order: this.fb.nonNullable.control<-1 | 1>(1, Validators.required)
    }),
    partitionBy: this.fb.nonNullable.group({
      field: ['', Validators.required],
      modifiers: this.fb.nonNullable.control<ValueModifier[]>(['int'], Validators.required)
    }),
    output: this.fb.nonNullable.array([this.fb.nonNullable.group({
      field: ['', Validators.required],
      value: [0],
      method: this.fb.control<"linear" | 'locf' | null>(null)
    })])
  });

  readonly sort = this.form.controls.sortBy;
  readonly partition = this.form.controls.partitionBy;
  readonly output = this.form.controls.output;

  readonly enablePartition = new FormControl(false);

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<FillStageOptions>>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const options: IAggrPiplineStage<FillStageOptions> = {
            type: AggrStageTypes.FILL,
            options: this.form.getRawValue()
          };
  
          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  filterField(field: TypedEntity) {
    return !["serial", "unknown", "location"].includes(field.type);
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  addOutput(options?: { field: string; value?: any; method?: "linear" | 'locf' | null; }) {
    this.output.push(this.fb.nonNullable.group({
      field: [options?.field || '', Validators.required],
      value: [options?.value ?? 0],
      method: this.fb.control<"linear" | 'locf' | null>(options?.method ?? null)
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

  writeValue(opt: IAggrPiplineStage<FillStageOptions>): void {
    this.sort.controls.field.setValue(opt?.options?.sortBy?.field || '');
    this.sort.controls.order.setValue(opt?.options?.sortBy?.order || 1);

    this.partition.controls.field.setValue(opt?.options?.partitionBy?.field || '');
    this.partition.controls.modifiers.setValue(opt?.options?.partitionBy?.modifiers || []);

    this.output.clear();

    for (const out of (opt?.options?.output || []))
      this.addOutput(out);
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
