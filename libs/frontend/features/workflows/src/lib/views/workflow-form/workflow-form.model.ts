import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { WorkflowAction, WorkflowStepAlgo } from "@pestras/shared/data-model";

export interface WorkflowFormModel {
  name: FormControl<string>;
  blueprint: FormControl<string>;
  max_review_days: FormControl<number>;
  cancelable: FormControl<boolean>;
  default_action: FormControl<Exclude<WorkflowAction, WorkflowAction.REVIEW>>;
  steps: FormArray<FormGroup<WorkflowStepOptionsFormModel>>;
}

export interface WorkflowStepOptionsFormModel {
  serial: FormControl<string>;
  users: FormControl<string[]>;
  algo: FormControl<WorkflowStepAlgo>;
}