/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { GroupStageOptions, CumulateMethod, TypedEntity, ValueModifier, IAggrPiplineStage, AggrStageTypes, GroupStageCumulateMethod, TypeKind } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-group-stage',
  templateUrl: './group-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: GroupStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: GroupStageForm }
  ]
})
export class GroupStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    by: this.fb.nonNullable.group({
      field: ['', Validators.required],
      as: [''],
      modifiers: this.fb.nonNullable.control<ValueModifier[]>([])   
    }),
    cumulate: this.fb.array([this.fb.nonNullable.group({
      field: ['', Validators.required],
      display_name: ['', Validators.required],
      method: this.fb.nonNullable.control<GroupStageCumulateMethod>('count', Validators.required),
      // name of field, math formula or number to count
      expr: this.fb.nonNullable.control<string | number>(1, Validators.required)
    })])
  });

  readonly by = this.form.controls.by;
  readonly cumulate = this.form.controls.cumulate;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<GroupStageOptions>>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          const options: IAggrPiplineStage<GroupStageOptions> = {
            type: AggrStageTypes.GROUP,
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
    return !['serial', 'unknown'].includes(field.type) && field.kind !== TypeKind.RANGE;
  }

  filterField(field: TypedEntity) {
    return ['int', 'double'].includes(field.type);
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  addCumulate(options?: { field: string; display_name: string; method: GroupStageCumulateMethod; expr: string | number; }) {
    this.cumulate.push(this.fb.nonNullable.group({
      field: [options?.field || '', Validators.required],
      display_name: [options?.display_name || '', Validators.required],
      method: this.fb.nonNullable.control<GroupStageCumulateMethod>(options?.method || 'count', Validators.required),
      // name of field, math formula or number to count
      expr: this.fb.nonNullable.control<string | number>(options?.expr ?? 1, Validators.required)
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

  writeValue(opt: IAggrPiplineStage<GroupStageOptions>): void {
    this.by.controls.field.setValue((opt?.options?.by as any)?.field || '');
    this.by.controls.as.setValue((opt?.options?.by as any)?.as || '');
    this.by.controls.modifiers.setValue((opt?.options?.by as any)?.modifiers || []);

    this.cumulate.clear()

    for (const cum of (opt?.options?.cumulate || []))
      this.addCumulate(cum)
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
