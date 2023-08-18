/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, LimitStageOptions, IAggrPiplineStage, AggrStageTypes } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-limit-stage',
  template: `
    <ng-container *contra="let c">

      <label [for]="id + '_limit'">{{c['limit']}}</label>
      <div [class]="'fc ' + fcClass">
        <input type="number" [id]="id + '_limit'" [formControl]="limit">
      </div>

    </ng-container>
  `,
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: LimitStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: LimitStageForm }
  ]
})
export class LimitStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly limit = new FormControl(10, { validators: Validators.required, nonNullable: true });

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<LimitStageOptions>>();

  ngOnInit(): void {
    this.limit.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          const options: IAggrPiplineStage<LimitStageOptions> = {
            type: AggrStageTypes.LIMIT,
            options: { limit: v }
          };

          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
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

  writeValue(opt: IAggrPiplineStage<LimitStageOptions>): void {
    this.limit.setValue(opt?.options?.limit || 10);
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
