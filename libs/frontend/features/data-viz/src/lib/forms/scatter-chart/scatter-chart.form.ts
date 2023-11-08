/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataVizScatterSerie, Field, ScatterDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-scatter-chart-form',
  templateUrl: './scatter-chart.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ScatterChartForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: ScatterChartForm }
  ]
})
export class ScatterChartForm implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  readonly form = this.fb.nonNullable.group({
    series: this.fb.nonNullable.array([this.fb.nonNullable.group({
      serie_name: ['', Validators.required],
      x: ['', Validators.required],
      y: ['', Validators.required],
      size: this.fb.nonNullable.group({
        field: '',
        min: 0,
        max: 100
      })
    })]),
    cluster: this.fb.nonNullable.control<number | null>(null),
    regression: this.fb.group({
      type: this.fb.nonNullable.control<'linear' | 'logarithmic' | 'exponential' | 'polynomial'>('linear', Validators.required),
      order: 2
    }),
  });

  readonly series = this.form.controls.series;
  readonly useRegression = this.fb.nonNullable.control(false);
  readonly useCluster = this.fb.nonNullable.control(false);
  readonly regressionType = this.form.controls.regression.controls.type

  disabled = false;
  touched = false;

  @Input({ required: true })
  dsFields!: Field[];
  @Input()
  fcClass = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const value = this.form.getRawValue();

          if (!this.useCluster.value)
            value.cluster = null;

          if (!this.useRegression.value)
            value.regression = null as any;

          this.onChange(value);
          !this.touched && (this.touched = true) && this.onTouched();
        });
      });
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  filterCatField(field: Field) {
    return !['serial', 'unknown'].includes(field.type)
      && ![TypeKind.RICH_TEXT, TypeKind.RANGE].includes(field.kind);
  }

  filterValueField(field: Field) {
    return ['int', 'double'].includes(field.type) || (field.type === 'category' && field.kind !== TypeKind.NONE);
  }

  addSerie(serie?: DataVizScatterSerie) {
    this.series.push(this.fb.nonNullable.group({
      x: [serie?.x || '', Validators.required],
      y: [serie?.y || '', Validators.required],
      serie_name: [serie?.serie_name || '', Validators.required],
      size: this.fb.nonNullable.group({
        field: serie?.size?.field || '',
        min: serie?.size?.min || 0,
        max: serie?.size?.max || 100
      })
    }));
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options?: ScatterDataVizOptions): void {
    // series
    this.series.clear();

    if (options?.series?.length)
      for (const serie of options.series)
        this.addSerie(serie);
    else
      this.addSerie();

    // cluster
    this.form.controls.cluster.setValue(options?.cluster ?? null);

    // regression
    this.form.controls.regression.controls.type.setValue(options?.regression?.type || 'linear');
    this.form.controls.regression.controls.order.setValue(options?.regression?.order || null);

    if (options?.regression) {
      this.useRegression.setValue(true);
    } else {
      this.useRegression.setValue(false);
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
