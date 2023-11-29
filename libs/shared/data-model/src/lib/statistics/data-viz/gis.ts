import { BaseDataViz, DataVizTypes } from './types';
import { ColorRangeOption } from './util';

export interface GISMapDataViz extends BaseDataViz<GISMapDataVizOptions> {
  type: DataVizTypes.GIS
}

export interface GISMapDataVizOptions {
  region: string;
  map: string;
  layers: string[];
  additional_layers: GISMapScatterDataVizOptions[];
}

export interface GISMapScatterDataVizOptions {
  size_field: string;
  color_field: string;
  location_field: string;
  color_range: ColorRangeOption[] | string[];
}