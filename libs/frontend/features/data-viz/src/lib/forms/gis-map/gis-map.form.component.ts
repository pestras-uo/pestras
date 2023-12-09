/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from "@angular/forms";
import { untilDestroyed } from "@pestras/frontend/ui";
import { Field, GISMapConfig, GISMapDataVizOptions, GISMapFeatureLayer, GisLayerTypes, Region, TypeKind, createField } from "@pestras/shared/data-model";
import { ColorRangeModal, CustomGisMapLayerModal, ExternalGisMapLayerModal, GisMapFormModal, PieFieldsModal } from "./gis-map.form.modal";

@Component({
  selector: 'pestras-gis-map-form',
  templateUrl: './gis-map.form.component.html',
  styles: [':host { display: block; }'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: GISMapFormComponent },
    { provide: NG_VALIDATORS, multi: true, useExisting: GISMapFormComponent }
  ]
})
export class GISMapFormComponent implements OnInit, ControlValueAccessor {
  private ud = untilDestroyed();

  readonly form = new FormGroup<GisMapFormModal>({
    region: new FormControl('', { nonNullable: true, validators: Validators.required }),
    map: new FormControl('', { nonNullable: true, validators: Validators.required }),
    layers: new FormControl([], { nonNullable: true }),
    external_layers: new FormArray<FormGroup<ExternalGisMapLayerModal>>([]),
    custom_layers: new FormArray<FormGroup<CustomGisMapLayerModal>>([]),
  });

  readonly regionCtrl = this.form.controls.region;
  readonly mapCtrl = this.form.controls.region;
  readonly extLayersCtrl = this.form.controls.external_layers;
  readonly cusLayersCtrl = this.form.controls.custom_layers;

  @Input({ required: true })
  dsFields!: Field[];
  @Input()
  fcClass = '';

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(this.ud())
      .subscribe(v => {
        setTimeout(() => {
          this.onChange(v);
          !this.touched && (this.touched = true) && this.onTouched();
        })
      });
  }

  mapRegion(region: Region) {
    return { name: region.name, value: region.serial };
  }

  mapMaps(map: GISMapConfig) {
    return { name: map.name, value: map.serial };
  }

  findMap(map: GISMapConfig, value: string) {
    return map.serial === value;
  }

  mapLayer(layer: GISMapFeatureLayer) {
    return { name: layer.name, value: layer.serial };
  }

  mapField(field: Field) {
    return { name: field.display_name, value: field.name };
  }

  filterValueField(field: Field) {
    return ['int', 'double'].includes(field.type) || (field.type === 'category' && field.kind !== TypeKind.NONE);
  }

  filterTitleField(field: Field) {
    return field.type === 'string';
  }

  addRegionNameField(fields: Field[], type: GisLayerTypes) {
    return type === 'point'
      ? fields
      : [...fields, createField({ name: 'region_name', display_name: 'region_name', type: 'string' })]
  }

  filterRegionField(field: Field) {
    return field.type === 'region';
  }

  filterLocField(field: Field) {
    return field.type === 'location';
  }

  addExternalLayer() {
    this.extLayersCtrl.push(new FormGroup<ExternalGisMapLayerModal>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      url: new FormControl('', { nonNullable: true, validators: Validators.required })
    }));
  }

  addCustomLayer() {
    this.cusLayersCtrl.push(new FormGroup<CustomGisMapLayerModal>({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      type: new FormControl('point', { nonNullable: true }),
      primary_field: new FormControl('', { nonNullable: true }),
      title_field: new FormControl('', { nonNullable: true }),
      details_fields: new FormControl([], { nonNullable: true }),
      size_field: new FormControl(null),
      color_field: new FormControl(null),
      opacity_field: new FormControl(null),
      location_field: new FormControl(null),
      region_field: new FormControl(null),
      pie_fields: new FormArray<FormGroup<PieFieldsModal>>([]),
      color_range: new FormArray<FormGroup<ColorRangeModal>>([])
    }));
  }

  addPieField(index: number) {
    this.cusLayersCtrl.at(index).controls.pie_fields.push(new FormGroup<PieFieldsModal>({
      field: new FormControl('', { nonNullable: true, validators: Validators.required }),
      color: new FormControl('', { nonNullable: true, validators: Validators.required })
    }));
  }

  addColorRange(index: number) {
    this.cusLayersCtrl.at(index).controls.color_range.push(new FormGroup<ColorRangeModal>({
      color: new FormControl('', { nonNullable: true }),
      value: new FormControl(0, { nonNullable: true, validators: Validators.required }),
      label: new FormControl('')
    }));
  }

  // ControlValueAccessor interface
  // --------------------------------------------------------------
  touched = false;
  disabled = false;

  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(options: GISMapDataVizOptions): void {
    //
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