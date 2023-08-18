/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConvertOperationOptions, TypedEntity } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-convert-operation',
  templateUrl: './convert-operation.form.html',
  styles: [`:host { display: block; }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ConvertOperationForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: ConvertOperationForm }
  ]
})
export class ConvertOperationForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("OPR");

  readonly form = this.fb.nonNullable.group({
    // select from fields list
    input: ['', Validators.required],
    // select target type
    to: this.fb.nonNullable.control<ConvertOperationOptions['to']>('string', Validators.required),
    onError: this.fb.nonNullable.control<any>('', Validators.required),
    onNull: this.fb.nonNullable.control<any>('')
  });

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<ConvertOperationOptions>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          this.onChange(v);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(this.form.getRawValue());
        });
      });
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (obj: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: ConvertOperationOptions): void {
    this.form.setValue({
      input: opt?.input || '',
      to: opt?.to || 'string',
      onError: opt?.onError || '',
      onNull: opt?.onNull || ''
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
