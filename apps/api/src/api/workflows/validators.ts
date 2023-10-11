import { WorkflowState, workflowStepAlgo } from "@pestras/shared/data-model";
import { Validall } from "@pestras/validall";

export enum WorkflowValidators {
  CREATE = 'createWorkflow',
  UPDATE_NAME = 'updateWorkflowName',
  UPDATE_STEPS = 'updateWorkflowParties'
}

const DEFAULT_ACTION = 'WorkflowDefaultAction';

new Validall(DEFAULT_ACTION, {
  $in: ['approve', 'reject'] as WorkflowState[]
});

const STEPS = 'WorkflowSteps';

new Validall(STEPS, {
  $is: 'notEmpty',
  $each: {
    users: { $is:'notEmpty', $each: { $type: 'string' } },
    max_review_days: { $type: 'number', $gte: 1 },
    default_action: { $ref: DEFAULT_ACTION },
    algo: { $enum: [...workflowStepAlgo] }
  }
})

new Validall(WorkflowValidators.CREATE, {
  blueprint: { $type: 'string' },
  name: { $type: 'string' },
  steps: { $ref: STEPS }
});

new Validall(WorkflowValidators.UPDATE_NAME, {
  name: { $type: 'string' }
});

new Validall(WorkflowValidators.UPDATE_STEPS, {
  steps: { $ref: STEPS }
});