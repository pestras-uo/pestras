/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MathExprOperation, MathExprOperationOptions, TypedEntity } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';


@Component({
  selector: 'app-math-expr-operation',
  templateUrl: './math-expr-operation.form.html',
  styles: [`:host { display: block; }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: MathExprOperationForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: MathExprOperationForm }
  ]
})
export class MathExprOperationForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected id = Serial.gen("OPR");

  readonly form = this.fb.nonNullable.group({
    expr: ['', [Validators.required, this.mathExpr()]],
    unit: ['']
  });

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<MathExprOperationOptions>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const v = { ...this.form.getRawValue(), variables: this.fields.filter(this.filterField).map(f => f.name) };

          this.onChange(v);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(v);
        });
      });
  }

  filterField(field: TypedEntity) {
    return ['int', 'double', 'ordinal'].includes(field.type)
  }

  mapField(field: TypedEntity) {
    return { name: field.name, value: field.name }
  }

  mathExpr(): ValidatorFn {
    return (control: AbstractControl) => {
      const expr: string = control.value;
      const vars = MathExprOperation.GetVariablesFromMathExpr(expr)

      for (const v of vars)
        if (this.fields.every(o => o.name !== v))
          return { mathExpr: v };

      return null;
    }
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(opt: MathExprOperationOptions): void {
    this.form.controls.expr.setValue(opt?.expr || '');
    this.form.controls.unit.setValue(opt?.unit || '');
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
