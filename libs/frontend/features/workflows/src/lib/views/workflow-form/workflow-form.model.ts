import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { WorkflowState, WorkflowStepAlgo } from "@pestras/shared/data-model";

export interface WorkflowFormModel {
  name: FormControl<string>;
  blueprint: FormControl<string>;
  steps: FormArray<FormGroup<WorkflowStepOptionsFormModel>>;
}

export interface WorkflowStepOptionsFormModel {
  serial: FormControl<string>;
  users: FormControl<string[]>;
  max_review_days: FormControl<number>;
  default_action: FormControl<Exclude<WorkflowState, 'review'>>;
  algo: FormControl<WorkflowStepAlgo>;
}