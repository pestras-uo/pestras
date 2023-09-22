import { WorkflowAction, WorkflowPartyAlgo } from "@pestras/shared/data-model";
import { Validall } from "@pestras/validall";

export enum WorkflowValidators {
  CREATE = 'createWorkflow',
  UPDATE_NAME = 'updateWorkflowName',
  UPDATE_MAX_REVIEW_DAYS = 'updateWorkflowMaxReviewDays',
  UPDATE_DEFAULT_ACTION = 'updateWorkflowDefaultAction',
  UPDATE_CANCELABLE = 'updateWorkflowCancelable',
  UPDATE_STEPS = 'updateWorkflowParties'
}

const DEFAULT_ACTION = 'WorkflowDefaultAction';

new Validall(DEFAULT_ACTION, {
  $in: [
    WorkflowAction.APPROVE,
    WorkflowAction.REJECT
  ]
});

const STEPS = 'WorkflowSteps';

new Validall(STEPS, {
  $is: 'notEmpty',
  $each: {
    users: { $is:'notEmpty', $each: { $type: 'string' } },
    algo: {
      $enum: [
        WorkflowPartyAlgo.ANY,
        WorkflowPartyAlgo.ANY_ALL,
        WorkflowPartyAlgo.ANY_MOST,
        WorkflowPartyAlgo.ALL_ANY,
        WorkflowPartyAlgo.MOST,
        WorkflowPartyAlgo.MOST_ANY
      ]
    }
  }
})

new Validall(WorkflowValidators.CREATE, {
  blueprint: { $type: 'string' },
  name: { $type: 'string' },
  max_review_days: { $type: 'number', $gte: 1 },
  default_action: { $ref: DEFAULT_ACTION },
  cancalable: { $type: 'boolean' },
  steps: { $ref: STEPS }
});

new Validall(WorkflowValidators.UPDATE_NAME, {
  name: { $type: 'string' }
});

new Validall(WorkflowValidators.UPDATE_MAX_REVIEW_DAYS, {
  days: { $type: 'number', $gte: 1 }
});

new Validall(WorkflowValidators.UPDATE_DEFAULT_ACTION, {
  default_action: { $ref: DEFAULT_ACTION }
});

new Validall(WorkflowValidators.UPDATE_CANCELABLE, {
  cancelable: { $type: "boolean" }
});

new Validall(WorkflowValidators.UPDATE_STEPS, {
  parties: { $ref: STEPS }
});