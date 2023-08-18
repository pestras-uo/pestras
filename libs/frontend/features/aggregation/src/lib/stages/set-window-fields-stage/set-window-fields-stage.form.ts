/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, SetWindowFieldsStageOptions, ValueModifier, IAggrPiplineStage, AggrStageTypes, WindowStageCumulateMethod } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

interface SetWindowFieldOutput {
  name: string;
  display_name: string;
  field: { name: string; modifiers: ValueModifier[] };
  method: WindowStageCumulateMethod;
  documents?: { start: number | 'unbounded' | 'current', end: number | 'unbounded' | 'current' } | null;
}

@Component({
  selector: 'app-set-window-fields-stage',
  templateUrl: './set-window-fields-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SetWindowFieldsStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: SetWindowFieldsStageForm }
  ]
})
export class SetWindowFieldsStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.group({
    outputs: this.fb.array([this.fb.nonNullable.group({
      name: ['', Validators.required],
      display_name: ['', Validators.required],
      method: this.fb.control<WindowStageCumulateMethod>('avg', { nonNullable: true, validators: Validators.required }),
      field: this.fb.nonNullable.group({
        name: ['', Validators.required],
        modifiers: this.fb.nonNullable.control<ValueModifier[]>(['int'], Validators.required)
      }),
      documents: this.fb.nonNullable.group({
        start: this.fb.nonNullable.control<number | 'unbounded' | 'current'>('unbounded', Validators.required),
        end: this.fb.nonNullable.control<number | 'unbounded' | 'current'>('current', Validators.required)
      })
    })]),
    sortBy: this.fb.array([this.fb.nonNullable.group({
      field: ['', Validators.required],
      order: this.fb.nonNullable.control<-1 | 1>(1, Validators.required)
    })], Validators.required),
    partitionBy: this.fb.nonNullable.group({
      field: ['', Validators.required],
      modifiers: this.fb.nonNullable.control<ValueModifier[]>(['int'], Validators.required)
    })
  });

  readonly outputs = this.form.controls.outputs;
  readonly sortBy = this.form.controls.sortBy;
  readonly partitionBy = this.form.controls.partitionBy;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';
  @Input()
  single = false;

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<SetWindowFieldsStageOptions>>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const options: IAggrPiplineStage<SetWindowFieldsStageOptions> = {
            type: AggrStageTypes.SET_WINDOW_FIELDS,
            options: this.form.getRawValue()
          };

          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  filterGroupField(field: TypedEntity) {
    return !['id', 'serial', 'unknown', 'object', 'map', 'array'].includes(field.type);
  }

  filterField(field: TypedEntity) {
    return ['oedinal', 'int', 'double'].includes(field.type);
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  addOutput(options?: SetWindowFieldOutput) {
    this.outputs.push(this.fb.nonNullable.group({
      name: [options?.name || '', Validators.required],
      display_name: [options?.display_name || '', Validators.required],
      method: this.fb.control<WindowStageCumulateMethod>(options?.method || 'avg', { nonNullable: true, validators: Validators.required }),
      field: this.fb.nonNullable.group({
        name: [options?.field.name || '', Validators.required],
        modifiers: this.fb.nonNullable.control<ValueModifier[]>(options?.field.modifiers || ['int'])
      }),
      documents: this.fb.nonNullable.group({
        start: this.fb.nonNullable.control<number | 'unbounded' | 'current'>('unbounded', Validators.required),
        end: this.fb.nonNullable.control<number | 'unbounded' | 'current'>('current', Validators.required)
      })
    }));
  }

  addSort(options?: { field: string; order: 1 | -1 }) {
    this.sortBy.push(this.fb.nonNullable.group({
      field: [options?.field || '', Validators.required],
      order: this.fb.nonNullable.control<-1 | 1>(options?.order ?? 1, Validators.required)
    }));
  }

  togglePartition(active: boolean) {
    active
      ? this.form.addControl('partitionBy', this.fb.nonNullable.group({
        field: ['', Validators.required],
        modifiers: this.fb.nonNullable.control<ValueModifier[]>(['int'], Validators.required)
      }))
      : (this.form as any).removeControl('partitionBy');
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: IAggrPiplineStage<SetWindowFieldsStageOptions>): void {
    this.outputs.clear();
    this.sortBy.clear();
    this.partitionBy.setValue(null as any);

    for (const out of (opt?.options?.outputs || []))
      this.addOutput(out);

    for (const sort of (opt?.options?.sortBy || []))
      this.addSort(sort);

    if (opt?.options?.partitionBy)
      this.partitionBy.setValue(opt.options.partitionBy);
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
