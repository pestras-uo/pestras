import { DataVizTypes, BaseDataViz } from "./types";

export interface TimelineDataViz extends BaseDataViz<TimelineDataVizOptions> {
  type: DataVizTypes.TIMELINE;
}

/**
 * ### Timeline Data Viz Options
 * Each data record (row) is considered as an individual serie.  
 * #### Visualization"
 * - Timespan or waterfall chart
 */
export interface TimelineDataVizOptions {
  /**
   * ### Series Name
   * - Each row represents a serie
   * #### Supported types:
   * - category
   * - ordinal
   * - region
   * - text
   */
  category_field: string;
  /**
   * ### Start Date Field
   * #### Supported types:
   * - date
   * - datetime
   */
  start_field: string;
  /**
   * ### End Date Field
   * #### Supported types:
   * - date
   * - datetime
   */
  end_field: string;
  /**
   * ### Indicator
   * Must be a percentage value
   * #### Supported types:
   * - int
   * - double
   * - number
   */
  indicator: string | null;
}
