import { BaseDataViz, DataVizTypes } from "./types";


export interface LineDataViz extends BaseDataViz<LineDataVizOptions> {
  type: DataVizTypes.LINE;
}

/**
 * ### Change Data Viz Options
 * #### Visualization:
 * - Line Chart
 * - Area Chart
 */
export interface LineDataVizOptions {
  /**
   * ### X Axis Field
   * #### Supported Types:
   * - date
   * - datetime
   * - time
   * - int
   */
  x: string;
  /**
   * ### Lines
   * - Each line field reresent a serie.
   */
  series: DataVizLineSerie[];

  area: boolean;
}

export interface DataVizLineSerie {
  /**
   * ### Serie name text
   */
  serie_name: string | null;
  /**
   * ### Y Axis Fields
   * - Category value.  
   * 
   * #### Supported Types:
   * - int
   * - double
   * - number
   */
  y: string;
  /**
   * ### Mark Lines
   * Show horizontal lines over over speceific values:
   * - average value
   * - min value
   * - max value
   */
  mark_lines: Array<'average' | 'min' | 'max'>;
  /**
   * ### Mark Points
   * Mark speccific values:
   * - average value
   * - min value
   * - max value
   */
  mark_points: Array<'average' | 'min' | 'max'>;
}