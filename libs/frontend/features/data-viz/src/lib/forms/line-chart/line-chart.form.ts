/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { DataVizLineSerie, Field, LineDataVizOptions, TypeKind } from '@pestras/shared/data-model';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-line-chart-form',
  templateUrl: './line-chart.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: LineChartForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: LineChartForm }
  ]
})
export class LineChartForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();

  readonly form = this.fb.nonNullable.group({
    x: ['', Validators.required],
    series: this.fb.nonNullable.array([this.fb.nonNullable.group({
      serie_name: '',
      y: ['', Validators.required],
      mark_lines: this.fb.nonNullable.control<('average' | 'min' | 'max')[]>([]),
      mark_points: this.fb.nonNullable.control<('average' | 'min' | 'max')[]>([])
    })]),
    area: false
  });

  readonly series = this.form.controls.series;

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

          this.onChange(value);
          !this.touched && (this.touched = true) && this.onTouched();
        });
      });
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  filterCatField(field: Field) {
    return !['serial', 'unknown', 'string'].includes(field.type)
      || (field.type === 'string' && field.kind === TypeKind.NONE);
  }

  filterValueField(field: Field) {
    return ['int', 'double', 'ordinal'].includes(field.type);
  }

  addSerie(serie?: DataVizLineSerie) {
    this.series.push(this.fb.nonNullable.group({
      serie_name: serie?.serie_name || '',
      y: [serie?.y || '', Validators.required],
      mark_lines: this.fb.nonNullable.control<('average' | 'min' | 'max')[]>(serie?.mark_lines || []),
      mark_points: this.fb.nonNullable.control<('average' | 'min' | 'max')[]>(serie?.mark_points || []),
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

  writeValue(options: LineDataVizOptions): void {
    this.form.controls.x.setValue(options?.x || '');
    this.form.controls.area.setValue(options?.area ?? false);

    this.series.clear();

    if (options?.series?.length)
      for (const serie of options.series)
        this.addSerie(serie);
    else
      this.addSerie();

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
