/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataRecord, DataStore, DataVizAggrStage, Field, aggrRecords, createField } from '@pestras/shared/data-model';
import { objUtil } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui'; 

interface StageOptions {
  control: FormControl<any>;
  input: Field[];
  output: Field[];
  data: DataRecord[];
}

@Component({
  selector: 'app-aggr',
  templateUrl: './aggr.form.html',
  styles: [`
    :host { display: block; }
    .dem { opacity: 0.5; pointer-events: none; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: AggrForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: AggrForm }
  ]
})
export class AggrForm implements ControlValueAccessor, OnInit, OnChanges {

  private ud = untilDestroyed();

  stages: StageOptions[] = [];
  select = this.fb.nonNullable.control<string>('filter', Validators.required);

  disabled = false;
  touched = false;

  recordsList: DataRecord[] = [];

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  records!: DataRecord[];
  @Input()
  fcClass = '';

  @Output()
  fieldsChange = new EventEmitter<Field[]>();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataStore']?.firstChange) {
      this.stages = [];
      setTimeout(() => this.fieldsChange.emit(this.dataStore.fields));
    }

    this.recordsList = this.records;
  }

  ngOnInit() {
    this.fieldsChange.emit(this.dataStore.fields);
  }

  addStage(stage?: DataVizAggrStage) {
    const control = new FormControl(stage ?? { type: this.select.value });
    const index = this.stages.length;
    const input = index === 0 ? this.dataStore.fields : this.stages[index - 1].output;
    const options: StageOptions = { control, input, output: [], data: [] };

    if (stage) {
      const { output, data } = this.getFields(options, index);
      options.output = output;
      options.data = data;

    } else {
      options.output = options.input;
      options.data = this.stages[index - 1]?.data ?? this.recordsList;
    }

    this.stages.push(options);

    control.valueChanges
      .pipe(this.ud())
      .subscribe(value => {
        if (!value)
          return;

        const curr = this.stages[index];
        const { output, data } = this.getFields(curr, index);

        curr.output = output;
        curr.data = data;

        this.fieldsChange.emit(curr.output);
        this.onChange(this.stages.map(s => s.control.value));
        !this.touched && (this.touched = true) && this.onTouched();
      });
  }

  private getFields(options: StageOptions, index: number) {
    const prevStageOptions = this.stages[index - 1] ?? null;
    const prevData = prevStageOptions ? prevStageOptions.data : this.recordsList;

    const { data, fields } = aggrRecords(options.input, objUtil.cloneObject(prevData), [options.control.value]);

    return { output: fields.map(f => createField(f)), data };
  }

  popStage() {
    this.stages = this.stages.slice(0, this.stages.length - 1);

    if (this.stages.length)
      this.fieldsChange.emit(this.stages[this.stages.length - 1].output)
    else
      this.fieldsChange.emit(this.dataStore.fields);

    this.onChange(this.stages.map(s => s.control.value));
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: DataVizAggrStage[]): void {
    this.stages = [];

    if (options?.length) {
      for (const stage of options)
        this.addStage(stage);
    }
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
