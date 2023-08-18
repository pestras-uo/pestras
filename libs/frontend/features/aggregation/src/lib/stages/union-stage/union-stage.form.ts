/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { AggrStageTypes, IAggrPiplineStage, TypedEntity, UnionStageOptions } from '@pestras/shared/data-model';
import { Serial } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-union-stage',
  templateUrl: './union-stage.form.html',
  styles: [':host { display: block }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: UnionStageForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: UnionStageForm }
  ]
})
export class UnionStageForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  protected readonly id = Serial.gen("STG");

  readonly form = this.fb.nonNullable.group({
    dataStore: ['', Validators.required],
    mapFields: this.fb.nonNullable.array([this.fb.nonNullable.group({
      src: ['', Validators.required],
      dest: ['', Validators.required]
    })])
  });

  readonly mapFields = this.form.controls.mapFields;
  readonly dataStore = this.form.controls.dataStore;

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
  changes = new EventEmitter<IAggrPiplineStage<UnionStageOptions>>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          const options: IAggrPiplineStage<UnionStageOptions> = {
            type: AggrStageTypes.UNION,
            options: this.form.getRawValue()
          };
  
          this.onChange(options);
          !this.touched && this.onTouched();
          this.touched = true;
          this.changes.emit(options);
        });
      });
  }

  addMap(map?: { src: string; dest: string; }) {
    this.mapFields.push(this.fb.nonNullable.group({
      src: [map?.src || '', Validators.required],
      dest: [map?.dest || '', Validators.required]
    }));
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

  writeValue(opt: IAggrPiplineStage<UnionStageOptions>): void {
    this.form.controls.dataStore.setValue(opt?.options?.dataStore || '');
    
    this.mapFields.clear();

    for (const map of (opt?.options?.mapFields ?? []))
      this.addMap(map);
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