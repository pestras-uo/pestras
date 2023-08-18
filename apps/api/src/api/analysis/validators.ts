import { Validall } from "@pestras/validall";
import { Validators } from "../../validators";

export enum AnalysisValidator {
  CREATE = 'createAnalysis',
  UPDATE = 'updateAnalysis'
}

new Validall(AnalysisValidator.CREATE, {
  entity: {
    type: { $type: 'string', $enum: ['dashboard', 'report'] },
    serial: { $type: 'string' },
    slide: { $type: 'string' },
    view: { $type: 'string' }
  },
  data: { $ref: Validators.ANALYSIS }
});

new Validall(AnalysisValidator.UPDATE, {
  $ref: Validators.ANALYSIS
});