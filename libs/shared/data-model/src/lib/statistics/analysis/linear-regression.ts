import { BaseAnalysis, AnalysisTypes } from "./types";

export const linearRegressionProps = [
  'covariance',
  'correlation_coefficient',
  'r_squared',
  'rmse'
] as const;

export type LinearRegressionProps = typeof linearRegressionProps[number];

// Describes the relation between to variables
// - field types: Numerics or Ordinals
// - visualizations: scatter plot
export interface LinearRegressionAnalysis extends BaseAnalysis {
  type: AnalysisTypes.LINEAR_REGRESSION;
  left: string;
  right: string;
}