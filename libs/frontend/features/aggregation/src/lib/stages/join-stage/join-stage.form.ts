/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { AggrStageTypes, IAggrPiplineStage, JoinStageOnOption, JoinStageOptions, TypedEntity, ValueModifier } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-join-stage',
  templateUrl: './join-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: JoinStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: JoinStageForm }
  ]
})
export class JoinStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    dataStore: ['', Validators.required],
    on: this.fb.nonNullable.array([this.fb.nonNullable.group({
      localField: this.fb.nonNullable.group({
        name: ['', Validators.required],
        modifiers: this.fb.nonNullable.control<ValueModifier[]>(['int'], Validators.required)
      }),
      foreignField: this.fb.nonNullable.group({
        name: ['', Validators.required],
        modifiers: this.fb.nonNullable.control<ValueModifier[]>(['int'], Validators.required)
      })
    })]),
    fields: this.fb.nonNullable.array([this.fb.nonNullable.group({
      name: ['', Validators.required],
      as: ''
    })])
  });

  readonly dataStore = this.form.controls.dataStore;
  readonly onOptions = this.form.controls.on;
  readonly fieldsList = this.form.controls.fields;

  disabled = false;
  touched = false;

  @Input({ required: true })
  rootDataStore!: string;
  @Input({ required: true })
  selfDataStore!: string;
  @Input({ required: true })
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<JoinStageOptions>>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          const options: IAggrPiplineStage<JoinStageOptions> = {
            type: AggrStageTypes.JOIN,
            options: this.form.getRawValue()
          };

          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  addOnOptions(options?: JoinStageOnOption) {
    this.onOptions.push(this.fb.nonNullable.group({
      localField: this.fb.nonNullable.group({
        name: [options?.localField.name || '', Validators.required],
        modifiers: this.fb.nonNullable.control<ValueModifier[]>(options?.localField.modifiers || ['int'], Validators.required)
      }),
      foreignField: this.fb.nonNullable.group({
        name: [options?.foreignField.name || '', Validators.required],
        modifiers: this.fb.nonNullable.control<ValueModifier[]>(options?.foreignField.modifiers || ['int'], Validators.required)
      })
    }))
  }

  addField(field?: { name: string; as?: string | null }) {
    this.fieldsList.push(this.fb.nonNullable.group({
      name: [field?.name || '', Validators.required],
      as: [field?.as ?? '']
    }))
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: IAggrPiplineStage<JoinStageOptions>): void {
    this.form.controls.dataStore.setValue(opt?.options?.dataStore || '');

    this.onOptions.clear();
    this.fieldsList.clear();

    for (const onOption of (opt?.options?.on ?? []))
      this.addOnOptions(onOption);

    for (const field of (opt?.options?.fields ?? []))
      this.addField(field);
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
