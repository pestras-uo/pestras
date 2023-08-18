/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, SetStageOption, ConvertOperationOptions } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';


@Component({
  selector: 'app-single-set-stage',
  templateUrl: './single-set-stage.form.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SingleSetStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: SingleSetStageForm }
  ]
})
export class SingleSetStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed()

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    field: ['', Validators.required],
    display_name: ['', Validators.required],
    operation: this.fb.nonNullable.control<SetStageOption['operation']>('convert', Validators.required),
    options: this.fb.nonNullable.control<any>(null)
  });

  readonly operation = this.form.controls.operation;

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<SetStageOption>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const v = this.form.getRawValue();

          if (!v.options)
            return;

          this.onChange(v);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(v);
        });
      });
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: SetStageOption): void {
    this.form.controls.field.setValue(opt?.field || '');
    this.form.controls.display_name.setValue(opt?.display_name || '');
    this.form.controls.operation.setValue(opt?.operation || 'convert');

    setTimeout(() => {
      this.form.controls.options.setValue(opt?.options || {
        input: this.fields[0].name,
        to: 'int',
        onError: 0,
        onNull: 0
      } as ConvertOperationOptions);
    });
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
