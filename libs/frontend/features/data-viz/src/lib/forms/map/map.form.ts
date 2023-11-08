/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Field, MapDataVizOptions, Region, TypeKind } from '@pestras/shared/data-model';
import { objUtil } from '@pestras/shared/util';
import { untilDestroyed } from '@pestras/frontend/ui';

@Component({
  selector: 'app-map-chart-form',
  templateUrl: './map.form.html',
  styles: [`
    :host { display: block; }
  `],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: MapForm },
    { provide: NG_VALIDATORS, multi: true, useExisting: MapForm }
  ]
})
export class MapForm implements OnInit, ControlValueAccessor {

  private ud = untilDestroyed();

  readonly type = this.fb.nonNullable.control<'regions' | 'scatter' | 'pie'>('regions', Validators.required);
  readonly form = this.fb.nonNullable.group({
    use_map: this.fb.nonNullable.group({
      region: ['', Validators.required],
      only_children: false
    }),
    regions: this.fb.nonNullable.group({
      region_field: ['', Validators.required],
      value_field: ['', Validators.required],
      color_range: this.fb.nonNullable.array([
        this.fb.nonNullable.control('#44DD66'),
        this.fb.nonNullable.control('#FFAA44'),
        this.fb.nonNullable.control('#FF4444'),
      ])
    }),
    scatter: this.fb.nonNullable.group({
      loc_field: ['', Validators.required],
      value_field: ['', Validators.required],
      google_map: false,
      size_field: '',
      effect_start_value: this.fb.control<number | null>(null),
      tooltip: this.fb.group({
        image: '',
        heading: '',
        body: this.fb.nonNullable.control<string[]>([], { validators: Validators.required })
      })
    }),
    pie: this.fb.nonNullable.group({
      category_field: ['', Validators.required],
      value_field: ['', Validators.required],
      region_field: ['', Validators.required],
      doughnut: false
    })
  });

  readonly regions = this.form.controls.regions;
  readonly colorRange = this.regions.controls.color_range;
  readonly scatter = this.form.controls.scatter;
  readonly pie = this.form.controls.pie;

  disabled = false;
  touched = false;

  @Input({ required: true })
  dsFields!: Field[];
  @Input()
  fcClass = '';

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(() => {
        setTimeout(() => {
          const value: any = this.form.getRawValue();

          if (this.type.value === 'regions')
            value.scatter = value.pie = null;
          else if (this.type.value === 'scatter')
            value.regions = value.pie = null;
          else
            value.regions = value.scatter = null;

          this.onChange(value);
          !this.touched && (this.touched = true) && this.onTouched();
        });
      });
  }

  mapRegion(region: Region) {
    return { name: region.name, value: region.serial };
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  filterValueField(field: Field) {
    return ['int', 'double'].includes(field.type) || (field.type === 'category' && field.kind !== TypeKind.NONE);
  }

  filterTooltipImageField(field: Field) {
    return field.type === 'image';
  }
  
  filterTooltipField(field: Field) {
    return field.type === 'string';
  }

  filterTooltipBodyField(field: Field) {
    return field.type !== 'serial';
  }

  filterCatField(field: Field) {
    return !['serial', 'unknown'].includes(field.type)
      && ![TypeKind.RICH_TEXT, TypeKind.RANGE].includes(field.kind);
  }

  filterRegionField(field: Field) {
    return field.type === 'region';
  }

  filterLocField(field: Field) {
    return field.type === 'location';
  }

  addColor(color?: string) {
    this.colorRange.push(this.fb.nonNullable.control(color || '#4466FF'))
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: MapDataVizOptions): void {
    if (objUtil.equals(options, this.form.getRawValue()))
      return;

    if (options) {
      if (options.regions) {
        this.type.setValue('regions');
        this.regions.controls.region_field.setValue(options.regions.region_field);
        this.regions.controls.value_field.setValue(options.regions.value_field);

        this.colorRange.clear();

        for (const color of options.regions.color_range)
          this.addColor(color);

      } else if (options.scatter) {
        this.type.setValue('scatter');
        this.scatter.controls.loc_field.setValue(options.scatter.loc_field);
        this.scatter.controls.value_field.setValue(options.scatter.value_field);
        this.scatter.controls.google_map.setValue(!!options.scatter.google_map);
        this.scatter.controls.size_field.setValue(options.scatter.size_field || '');
        this.scatter.controls.tooltip.setValue(options.scatter.tooltip || { body: [], image: '', heading: '' } as any);
        this.scatter.controls.effect_start_value.setValue(options.scatter.effect_start_value ?? null);

      } else if (options.pie) {
        this.type.setValue('pie');
        this.pie.controls.category_field.setValue(options.pie.category_field || '');
        this.pie.controls.value_field.setValue(options.pie.value_field);
        this.pie.controls.region_field.setValue(options.pie.region_field);
        this.pie.controls.doughnut.setValue(options.pie.doughnut ?? false);
      }

    } else {
      this.type.setValue('regions');
      this.regions.controls.region_field.setValue('');
      this.regions.controls.value_field.setValue('');

      this.colorRange.clear();
      this.addColor('#44FF66');
      this.addColor('#FFDD66');
      this.addColor('#FF4444');
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
