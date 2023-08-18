/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, SetStageOptions, SetStageOption, IAggrPiplineStage, AggrStageTypes } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';


@Component({
  selector: 'app-set-stage',
  templateUrl: './set-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SetStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: SetStageForm }
  ]
})
export class SetStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    fields: this.fb.nonNullable.array([this.fb.nonNullable.control<SetStageOption>({
      field: '',
      operation: 'convert',
      options: { input: '', to: 'int', onError: 0, onNull: 0 }
    } as SetStageOption)])
  });

  readonly list = this.form.controls.fields;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<SetStageOptions>>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const options: IAggrPiplineStage<SetStageOptions> = {
            type: AggrStageTypes.SET,
            options: this.form.getRawValue()
          };

          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  addField(field?: SetStageOption) {
    this.list.push(this.fb.nonNullable.control<SetStageOption>(field as SetStageOption), { emitEvent: false });
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: IAggrPiplineStage<SetStageOptions>): void {
    this.list.clear();

    for (const field of (opt?.options?.fields || []))
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
