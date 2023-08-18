/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataVizAggrStage } from "./aggregate";

export enum DataVizTypes {
  //  - field types: Category, Ordinal or Boolean
  //  - calculations: percentages
  //  - visualizations: 
  //    - 1 var: bar, pie and donut chart
  //    - 2 vars: marimeko, stacked bar, negative stack bar, and polar area chart
  //    - 3+ vars: stacked bar
  BAR = 'bar',
  // - field types: Numeric only
  // - visualizations: Progress Bar or Circle
  BOXPLOT = 'boxplot',
  // Two variables charts
  // - y change through x interval
  // - y type: Numeric
  // - x type: Date, Datetime, Time or Numeric
  // - visualizations: line, area or density chart
  LINE = 'line',
  // Show hierarchical relationship between entities
  // could link colors and or size to some fields
  //  - field types:
  //    - color: Numeric, Ordinal
  //    - size: Numeric, Ordinal
  //  - visualizations: Sun burst
  HIERARCHICAL = 'hierarchical',
  // Map chart with different colors regions
  // may include sub series
  //  - field types: 
  //    - map colors: Numeric or Ordinal
  //    - sub series:
  //      - scatter:
  //        - loc: Location
  //        - size: Numeric or Ordinal
  //        - color: Numeric or Ordinal
  //      - pie:
  //        - field: categorical
  //        - region: Region
  MAP = 'map',
  PIE = 'pie',
  // Two plus graph
  // - field types: Numeric, Ordinal, Boolean, Categorical,
  // - visualizations:
  //    - 2 vars: scatter plot
  //    - 3 vars: bubble plot
  SCATTER = 'scatter',
  POLAR = 'polar',
  // visualize three or more variables
  //  - field types: Numircal or Ordinal
  //  - visualizations: Radar Chart
  RADAR = 'radar',
  // Data Table
  TABLE = 'table',
  // Display timespans between two dates or times
  // - field types: Date, Datetime or time
  // - visualizations: Timespan or waterfall chart
  TIMELINE = 'timeline'
}

export interface BaseDataViz<T = any>  {
  serial: string;
  data_store: string;
  aggregate: DataVizAggrStage[];
  type: DataVizTypes;
  options: T;

  create_date: Date;
  last_modified: Date;
}