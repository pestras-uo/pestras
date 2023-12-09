// Importing necessary types
import { BaseDataViz, DataVizTypes } from './types';

// Defining the HeatmapDataViz interface that extends BaseDataViz
export interface HeatmapDataViz extends BaseDataViz<HeatmapDataVizOptions> {
  type: DataVizTypes.HEATMAP; // Correcting the type to HEATMAP
}

/**
 * ### Heatmap Data Viz Options
 * #### Visualization:
 * - Cartesian heatmap chart
 */
export interface HeatmapDataVizOptions {
  /**
   * ### X-Axis Field
   * - Represents values on the X-axis.
   *
   * #### Supported Types:
   * - int
   * - category
   * - date
   * - datetime,
   * - time,
   * - string
   */
  x_axis_field: string;

  /**
   * ### Y-Axis Field
   * - Represents values on the Y-axis.
   *
   * #### Supported Types:
   * - int
   * - category
   * - date
   * - datetime,
   * - time,
   * - string
   */
  y_axis_field: string;

  /**
   * ### Value Field
   * - Represents the intensity of the heatmap at each coordinate.
   *
   * #### Supported Types:
   * - int
   * - double
   * - ordinal category
   * - range category
   */
  value_field: 'string'; // Update the data type to reflect numerical values
}

export interface HeatmapDataPoint {
  xValue: string;
  yValue: string;
  value: number;
}
