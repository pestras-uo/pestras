import { BaseDataViz, DataVizTypes } from './types';

export interface HeatmapDataViz extends BaseDataViz<HeatmapDataVizOptions> {
  type: DataVizTypes.HEATMAP;
}

/**
 * ### Heatmap Data Viz Options
 * #### Visualization:
 * - Heatmap chart
 */
export interface HeatmapDataVizOptions {
  /**
   * ### Value Field
   * - Each field (column) represents a data point in the heatmap
   * - Values determine the color intensity in the heatmap
   *
   * #### Supported Types:
   * - int
   * - double
   * - number
   */
  value_field: string;
  /**
   * ### Row Field
   * - Each row represents a row in the heatmap
   */
  row_field: string;
  /**
   * ### Column Field
   * - Each column represents a column in the heatmap
   */
  column_field: string;
  heatmap_orientation?: 'horizontal' | 'vertical';
}
