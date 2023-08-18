import { PieDataVizOptions } from "./pie";
import { BaseDataViz, DataVizTypes } from "./types";

// Map chart with different colors regions
// may include sub series
//  - field types: 
//    - map colors: Numeric or Ordinal
//    - sub series:
//      - scatter:
//        - loc: Location
//        - size: Numeric or Ordinal
//        - color: Numeric or Ordinal
//      - pie:
//        - field: categorical
//        - region: Region
export interface MapDataViz extends BaseDataViz<MapDataVizOptions> {
  type: DataVizTypes.MAP;
}

export interface MapDataVizOptions {
  use_map: { region: string; only_children: boolean; } | null;
  regions: MapRegionsDataVizOptions | null;
  scatter: MapScatterDataVizOptions | null;
  pie: MapPieDataVizOptions | null;
}

export interface MapRegionsDataVizOptions {
  region_field: string;
  value_field: string;
  color_range: string[];
}

export interface MapScatterTooltopOptions {
  image: string | null;
  heading: string | null;
  body: string[];
}

export interface MapScatterDataVizOptions {
  /**
   * ### Region serial
   */
  loc_field: string;
  value_field: string;
  size_field: string | null;
  effect_start_value: number | null;
  google_map: boolean | null;
  tooltip: MapScatterTooltopOptions | null;
}

export interface MapPieDataVizOptions extends PieDataVizOptions {
  region_field: string;
}