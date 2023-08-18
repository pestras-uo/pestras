/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, UnsetStageOptions, IAggrPiplineStage, AggrStageTypes } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-unset-stage',
  templateUrl: './unset-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: UnsetStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: UnsetStageForm }
  ]
})
export class UnsetStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    fields: this.fb.nonNullable.control<string[]>([], Validators.required)
  });

  readonly fieldsList = this.form.controls.fields;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<UnsetStageOptions>>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const options: IAggrPiplineStage<UnsetStageOptions> = {
            type: AggrStageTypes.UNSET,
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

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: IAggrPiplineStage<UnsetStageOptions>): void {
    this.fieldsList.setValue(opt?.options?.fields || []);
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
