import { Validall } from "@pestras/validall";
import { Validators } from ".";
import { AnalysisTypes } from "@pestras/shared/data-model";


// Series Base
// -----------------------------------------------------------------------------
const SERIES_BASE = 'analysisSeriesBase';

new Validall(SERIES_BASE, {
  order: { $type: 'number', $message: 'invalidSeriesOrder' },
  title: { $type: 'string', $message: 'invalidAnalysisSeriesTitle' }
});



// descriptive
// -----------------------------------------------------------------------------
const DESCRIPTIVE = 'descriptiveAnalysis';

new Validall(DESCRIPTIVE, {
  type: { $equals: AnalysisTypes.DESCRIPTIVE },
  field: { $type: 'string', $message: 'invalidDescriptiveSeriesField' },
  is_sample: { $type: 'boolean', $default: false }
});



// linearRegression
// -----------------------------------------------------------------------------
const LINEAR_REGRESSION = 'linearRegressionAnalysis';

new Validall(LINEAR_REGRESSION, {
  type: { $equals: AnalysisTypes.LINEAR_REGRESSION },
  left: { $type: 'string', $message: 'invalidLinearRegressionSeriesLeftField' },
  right: { $type: 'string', $message: 'invalidLinearRegressionSeriesRightField' }
});



// Analysis
// -----------------------------------------------------------------------------
new Validall(Validators.ANALYSIS, {
  $props: {
    data_store: { $type: 'string', $message: 'invalidDataStoreId' },
    title: { $type: 'string', $message: 'analysisTitleIsRequired' }
  },
  $or: [
    { $ref: DESCRIPTIVE },
    { $ref: LINEAR_REGRESSION }
  ]
});