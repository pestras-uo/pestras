import { BaseDataViz, DataVizTypes } from "./types";


export interface PieDataViz extends BaseDataViz<PieDataVizOptions> {
  type: DataVizTypes.BAR;
}

/**
 * ### Pie Data Viz Options
 * #### Visualization:
 * - pie or donut chart
 */
export interface PieDataVizOptions {
  /**
   * ### Value Field
   * - Category value.
   * 
   * #### Supported Types:
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
  doughnut: boolean;
}
