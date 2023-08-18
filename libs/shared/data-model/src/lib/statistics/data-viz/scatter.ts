import { BaseDataViz, DataVizTypes } from "./types";


// Two plus graph
// - field types: Numeric, Ordinal, Boolean, Categorical,
// - visualizations:
//    - 2 vars: scatter plot
//    - 3 vars: bubble plot
export interface ScatterDataViz extends BaseDataViz<ScatterDataVizOptions> {
  type: DataVizTypes.SCATTER;
}

/**
 * ### Scatter Data Viz Options
 * #### Visualization:
 * - scatter chart
 * - regression line
 */
export interface ScatterDataVizOptions {
  /**
   * ### Point Fields
   * - Each Point fields reresent a serie.
   */
  series: DataVizScatterSerie[];
  /**
   * ### Regression Analysis
   * Draw regression line
   */
  regression: ScatterDataVizRegressionOptions | null;
  /**
   * ### Clustering data
   * Cluster data to different categories.
   * - Number of colors define number of clusters
   * - When defined group field will be ignored as will as other y_fields
   */
  cluster: number| null;
}

export interface DataVizScatterSerie {
  /**
   * ### Serie name text
   */
  serie_name: string | null;
  /**
   * ### X Axis Field.
   * 
   * #### Supported Types:
   * - date
   * - datetime
   * - time
   * - int
   * - double
   * - number
   * - ordinal
   * - categorical
   * - region
   */
  x: string;
  /**
   * ### Y Axis Fields.
   * 
   * #### Supported Types:
   * - date
   * - datetime
   * - time
   * - int
   * - double
   * - number
   * - ordinal
   * - categorical
   * - region
   */
  y: string;
  /**
   * ### Size Field
   * Controls the size of each plot.
   */
  size: ScatterDataVizSizeOptions | null;
}

export interface ScatterDataVizSizeOptions {
  field: string;
  min: number | null;
  max: number | null;
}

export interface ScatterDataVizRegressionOptions {
  type: 'linear' | 'logarithmic' | 'exponential' | 'polynomial';
  /**
   * ### Polynomial order
   * Only for **polynomial** type
   */
  order: number | null;
}