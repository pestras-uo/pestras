/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TypedEntity, SampleStageOptions, IAggrPiplineStage, AggrStageTypes } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-sample-stage',
  template: `
    <ng-container *contra="let c">

      <label [for]="id + '_size'">{{c['count']}}</label>
      <div [class]="'fc ' + fcClass">
        <input type="number" [id]="id + '_size'" [formControl]="size">
      </div>

    </ng-container>
  `,
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SampleStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: SampleStageForm }
  ]
})
export class SampleStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly size = new FormControl(10, { validators: Validators.required, nonNullable: true });

  disabled = false;
  touched = false;

  @Input()
  fields: TypedEntity[] = [];
  @Input()
  fcClass = '';

  @Output()
  changes = new EventEmitter<IAggrPiplineStage<SampleStageOptions>>();

  ngOnInit(): void {
    this.size.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          const options: IAggrPiplineStage<SampleStageOptions> = {
            type: AggrStageTypes.SAMPLE,
            options: { size: v }
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

  writeValue(opt: IAggrPiplineStage<SampleStageOptions>): void {
    this.size.setValue(opt?.options?.size || 10);
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
