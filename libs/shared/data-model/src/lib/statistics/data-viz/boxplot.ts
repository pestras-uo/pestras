import { BaseDataViz, DataVizTypes } from "./types";

// - field types: Numeric only
// - visualizations: Boxplot Bar or Circle
export interface BoxplotDataViz extends BaseDataViz<BoxplotDataVizOptions> {
  type: DataVizTypes.BOXPLOT;
}

// each data record (row) is considered as an individual serie
export interface BoxplotDataVizOptions {
  /**
   * ### Value Fields
   * - Each field represents a serie
   * - at least ten rows must be available for this chart to report properly
   * 
   * #### Supported Types:
   * - int
   * - double
   * - number
   */
  value_fields: string[];
}