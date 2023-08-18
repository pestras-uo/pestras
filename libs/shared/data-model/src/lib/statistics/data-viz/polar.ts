import { DataVizTypes, BaseDataViz } from "./types";

export interface PolarDataViz extends BaseDataViz<PolarDataVizOptions> {
  type: DataVizTypes.TIMELINE;
}

/**
 * ### Polar Data Viz Options
 * Each data record (row) is considered as an individual serie.  
 * #### Visualization"
 * - Polar chart
 */
export interface PolarDataVizOptions {
  /**
   * ### Value Field
   * - values must be percentages
   * - each field represent a serie
   * #### Supported types:
   * - int
   * - double
   * - number
   */
  value_field: string;
  /**
   * ### Category Field
   * When category field is defined:  
   * Only first value column will be considered,
   * otherwise each value column will represent different category.
   * 
   * #### Supported Types:
   * - reference,
   * - string,
   * - boolean
   */
  category_field: string;
  /**
   * ### Indicator
   * Gives color to each values range
   * - 0 - 33: red
   * - 34 - 66 orange
   * - 67 - 100 green
   */
  indicator: boolean;
  /**
   * ### Reverse Indicator
   * Reverses the colors applied to values ranges
   */
  reverse_indicator: boolean;
}