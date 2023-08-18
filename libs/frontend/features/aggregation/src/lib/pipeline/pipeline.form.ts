/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { AggrStageTypes, DataStore, Field, IAggrPiplineStage, TypedEntity, aggrStageFactory } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';
import { DataStoresState } from '@pestras/frontend/state';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-aggr-pipeline',
  templateUrl: './pipeline.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: PipelineForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: PipelineForm }
  ]
})
export class PipelineForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  readonly addControl = new FormControl<AggrStageTypes>(AggrStageTypes.MATCH, { validators: Validators.required, nonNullable: true });

  readonly form = this.fb.nonNullable.group({
    stages: this.fb.nonNullable.array<IAggrPiplineStage>([])
  });

  stages = this.form.controls.stages;

  inOutStates: { inState: TypedEntity[]; outState: TypedEntity[]; }[] = [];
  disabled = false;
  touched = false;

  @Input({ required: true })
  from!: DataStore;
  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;

  @Output()
  changes = new EventEmitter<IAggrPiplineStage[]>();
  @Output()
  done = new EventEmitter<IAggrPiplineStage[]>();

  constructor(
    private state: DataStoresState,
    private fb: FormBuilder
  ) { }

  private getDataStoreFields(serial: string): Promise<Field[]> {
    return new Promise(res => this.state.select(serial)
      .pipe(filter(Boolean), take(1))
      .subscribe(ds => res(ds.fields))
    );
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(async () => {
        const stages = this.stages.value;

        if (stages.length > 0) {
          const lastStage = stages[stages.length - 1];
          const fields = lastStage.type === AggrStageTypes.JOIN && lastStage.options?.dataStore
            ? await this.getDataStoreFields(lastStage.options.dataStore)
            : [];

          const stage = aggrStageFactory(lastStage, this.inOutStates[stages.length - 1].inState, () => fields);
          this.inOutStates[stages.length - 1].outState = stage?.outputType() || [];

        } else {
          this.inOutStates = [];
        }

        this.onChange(this.stages.value);
        this.changes.emit(this.stages.value);
        !this.touched && this.onTouched();
        this.touched = true;
      });
  }

  async init(stages: IAggrPiplineStage[]) {
    this.stages.clear();
    this.inOutStates = [];

    for (const stage of stages)
      await this.addStage(stage.type, stage.options);
  }

  removeStage() {
    this.inOutStates = this.inOutStates.slice(0, this.inOutStates.length - 1);
    this.stages.removeAt(this.stages.length - 1);
  }

  async addStage(type: AggrStageTypes, options: any = null) {
    const state: { inState: TypedEntity[]; outState: TypedEntity[]; } = { inState: [], outState: [] };
    const lastState = this.inOutStates[this.inOutStates.length - 1];
    const stages = this.stages.value;
    const lastStage = stages[stages.length - 1] || null;

    if (lastState)
      state.inState = lastState.outState;
    else
      state.inState = this.from.fields;

    if (options) {
      const fields = type === AggrStageTypes.JOIN && options?.dataStore
        ? await this.getDataStoreFields(options.dataStore)
        : [];

      const stage = aggrStageFactory({ type, options }, state.inState, () => fields);
      state.outState = stage?.outputType() ?? [];
    }


    this.inOutStates = this.inOutStates.concat(state);
    this.stages.push(new FormControl<IAggrPiplineStage>({ type, options }, { nonNullable: true }), { emitEvent: false });
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(stages: IAggrPiplineStage[]): void {
    this.init(stages);
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
