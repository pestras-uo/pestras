import { BaseAnalysis, AnalysisTypes } from "./types";

//  - field types: Numeric and Ordinals
//  - calculations: statsDescPropsList
//  - visualizations: histogram, box & whiskers plot
export interface DescriptiveAnalysis extends BaseAnalysis {
  type: AnalysisTypes.DESCRIPTIVE;
  field: string;
  is_sample: boolean;
}