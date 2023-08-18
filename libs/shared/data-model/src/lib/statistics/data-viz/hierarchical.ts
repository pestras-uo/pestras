import { BaseDataViz, DataVizTypes } from "./types";

// Show hierarchical relationship between entities
// could link colors and or size to some fields
//  - field types:
//    - color: Numeric, Ordinal
//    - size: Numeric, Ordinal
//  - visualizations: Sun burst
export interface HierarchicalDataViz extends BaseDataViz<HierarchicalDataVizOptions> {
  type: DataVizTypes.HIERARCHICAL;
}

export interface HierarchicalDataVizOptions {
  color_range: Array<string> | null;
  name_field?: string | null;
  size_field?: string | null; // null = by children count
}