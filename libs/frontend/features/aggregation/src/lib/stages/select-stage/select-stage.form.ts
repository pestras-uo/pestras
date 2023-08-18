/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, SelectStageOptions, IAggrPiplineStage, AggrStageTypes } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-select-stage',
  templateUrl: './select-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SelectStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: SelectStageForm }
  ]
})
export class SelectStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    fields: this.fb.nonNullable.array([this.fb.nonNullable.group({
      name: ['', Validators.required],
      as: this.fb.control<string | null>(null)
    })])
  });

  readonly fieldsList = this.form.controls.fields;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<SelectStageOptions>>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const options: IAggrPiplineStage<SelectStageOptions> = {
            type: AggrStageTypes.SELECT,
            options: this.form.getRawValue()
          };

          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  addField(field?: { name: string; as?: string | null }) {
    this.fieldsList.push(this.fb.nonNullable.group({
      name: [field?.name || '', Validators.required],
      as: this.fb.control<string | null>(field?.as ?? null)
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

  writeValue(opt: IAggrPiplineStage<SelectStageOptions>): void {
    this.fieldsList.clear();

    for (const field of (opt?.options?.fields || []))
      this.addField(field)
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
