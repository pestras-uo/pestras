import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { GisLayerTypes } from "@pestras/shared/data-model";

export interface GisMapFormModal {
  region: FormControl<string>;
  map: FormControl<string>;
  layers: FormControl<string[]>;
  external_layers: FormArray<FormGroup<ExternalGisMapLayerModal>>; 
  custom_layers: FormArray<FormGroup<CustomGisMapLayerModal>>;
}

export interface ExternalGisMapLayerModal {
  name: FormControl<string>;
  url: FormControl<string>;
}

export interface CustomGisMapLayerModal {
  name: FormControl<string>;
  type: FormControl<GisLayerTypes>;
  primary_field: FormControl<string>;
  title_field: FormControl<string>;
  details_fields: FormControl<string[]>;
  size_field: FormControl<string | null>;
  color_field: FormControl<string | null>;
  opacity_field: FormControl<string | null>;
  location_field: FormControl<string | null>;
  region_field: FormControl<string | null>;
  pie_fields: FormArray<FormGroup<PieFieldsModal>>;
  color_range: FormArray<FormGroup<ColorRangeModal>>;
}

export interface ColorRangeModal {
  color: FormControl<string>;
  value: FormControl<number>;
  label: FormControl<string | null>;
}

export interface PieFieldsModal {
  field: FormControl<string>;
  color: FormControl<string>;
}