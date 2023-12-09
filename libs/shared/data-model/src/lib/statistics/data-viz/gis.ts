import { BaseDataViz, DataVizTypes } from './types';
import { ColorRangeOption } from './util';

export const gisLayerTypes = ['point', 'polygon', 'pie'] as const;
export type GisLayerTypes = typeof gisLayerTypes[number];

export interface GISMapDataViz extends BaseDataViz<GISMapDataVizOptions> {
  type: DataVizTypes.GIS
}

export interface GISMapDataVizOptions {
  region: string;
  map: string;
  layers: string[];
  external_layers: GISMapDataVizExternalLayerOptions[];
  custom_layers: GISMapDataVizLayerOptions[];
}

export interface GISMapDataVizExternalLayerOptions {
  name: string;
  url: string;
}

export interface GISMapDataVizLayerOptions {
  name: string;
  type: GisLayerTypes;
  // popup template content
  primary_field: string;
  title_field: string;
  details_fields: string[];
  // only for point or pie types
  size_field: string | null;
  // for point or polygon types
  color_field: string | null;
  // for point or polygon types
  opacity_field: string | null;
  // only when type is points or pie
  location_field: string | null;
  // only when type is polygon
  region_field: string | null;
  // only when type is pie
  pie_fields: GISPieChartFieldOptions[];
  // for point or polygon types
  color_range: ColorRangeOption[];
}

export interface GISPieChartFieldOptions {
  field: string;
  color: string;
}

