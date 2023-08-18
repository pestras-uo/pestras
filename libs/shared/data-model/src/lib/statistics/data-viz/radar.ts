import { BaseDataViz, DataVizTypes } from "./types";


// visualize three or more variables
//  - field types: Numircal or Ordinal
//  - visualizations: Radar Chart
export interface RadarDataViz extends BaseDataViz<RadarDataVizOptions> {
  type: DataVizTypes.RADAR;
}


// each data record (row) is considered as an individual serie
export interface RadarDataVizOptions {
  /**
   * ### Value Fields
   * - Category value.  
   * - Each field reresents a serie.
   * - Each row represents a category
   * 
   * #### Supported Types:
   * - int
   * - double
   * - number
   */
  value_fields: string[];
  category_field: string;
}