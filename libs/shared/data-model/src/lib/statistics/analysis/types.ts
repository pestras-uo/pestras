// types of analysis
export enum AnalysisTypes {
  //  - field types: Numeric and Ordinals
  //  - calculations: statsDescPropsList
  //  - visualizations: histogram, box & whiskers plot
  DESCRIPTIVE = 'descriptive_statistics',
  // Describes the relation between to variables
  // - field types: Numerics or Ordinals
  // - visualizations: scatter plot
  LINEAR_REGRESSION = 'linear_regression',
  MULTI_LINEAR_REGRESSION = 'multi_linear_regression',
  POLYNOMIAL_REGRESSION = 'polynomial_regression',
  LOGISTIC_REGRESSION = 'logistic_regression',
  RIDGE_REGRESSION = 'ridge_regression',
  LASSO_REGRESSION = 'lasso_regression',
  BAYESIAN_REGRESSION = 'bayesian_regression',
  DECISION_TREE_REGRESSION = 'decision_regression',
  RAND_FOREST_REGRESSION = 'rand_forest_regression',

  HYPO_TEST_MEAN = 'hypo_test_mean',
  HYPO_TEST_PROP = 'hypo_test_prop',
  HYPO_TEST_FREQ = 'hypo_test_freq'
}

export interface BaseAnalysis  {
  serial: string;
  src: { blueprint: string; datastore: string; };
  type: AnalysisTypes;

  create_date: Date;
  last_modified: Date;
}