/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataVizLimit } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-limit',
  templateUrl: './limit.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: LimitForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: LimitForm }
  ]
})
export class LimitForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  readonly serial = Serial.gen();

  readonly form = this.fb.nonNullable.group({
    type: 'limit',
    count: [10, Validators.required],
    end: false
  });

  disabled = false;
  touched = false;
  
  @Input()
  fcClass = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          
          if (!this.form.valid)
            return;
            
          const value = this.form.getRawValue();
  
          this.onChange(value);
          !this.touched && this.onTouched();
          this.touched = true;
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

  writeValue(options: DataVizLimit): void {
    this.form.controls.count.setValue(options?.count ?? 10);
    this.form.controls.end.setValue(!!options?.count);
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
