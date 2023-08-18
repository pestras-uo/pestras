import { DataVizTypes, BaseDataViz } from "./types";

export interface TableDataViz extends BaseDataViz<TableDataVizOptions> {
  type: DataVizTypes.TABLE;
}

/**
 * ### Table Data Viz Options
 */
export interface TableDataVizOptions {
  pagination: number;
  /**
   * ### Indicator
   * Adds colorfull indicator related to specifif field value
   */
  indicator: TableDataVizIndicatorOptions | null;
}

export interface TableDataVizIndicatorOptions {
  field: string;
  levels: {
    orange: number;
    red: number;
    blink: number | null;
  }
}