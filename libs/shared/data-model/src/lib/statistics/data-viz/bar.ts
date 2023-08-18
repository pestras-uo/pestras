import { BaseDataViz, DataVizTypes } from "./types";


export interface BarDataViz extends BaseDataViz<BarDataVizOptions> {
  type: DataVizTypes.BAR;
}

/**
 * ### Bar Data Viz Options
 * #### Visualization:
 * - single serie: bar chart
 * - muliple series: stacked bar
 */
export interface BarDataVizOptions {
  /**
   * ### Value Fields
   * - Each field (column) represents a serie
   * - Each row represents a bar
   * 
   * #### Supported Types:
   * - int
   * - double
   * - number
   */
  value_fields: string[];
  category_field: string;
  /**
   * Horizontal bars
   */
  horizontal: boolean;
}
