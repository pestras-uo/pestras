import { BaseDataViz, DataVizTypes } from './types';
import { ColorRangeOption } from './util';

export const gisLayerTypes = ['point', 'polyline', 'polygone'] as const;
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
  title_field: string;
  details_fields: string[];
  // only for point type
  size_field: string | null;
  // for all types
  color_field: string | null;
  opacity_field: string | null;
  // only when type is points
  location_field: string | null;
  // only when type is polygon
  region_field: string | null;
  // visual maps
  color_range: ColorRangeOption[];
}

