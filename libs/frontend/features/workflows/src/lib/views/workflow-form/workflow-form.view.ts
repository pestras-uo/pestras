/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { WorkflowsState } from "libs/frontend/state/src/lib/workflows/workflows.state";
import { WorkflowFormModel, WorkflowStepOptionsFormModel } from "./workflow-form.model";
import { User, Workflow, WorkflowAction, WorkflowStepAlgo } from "@pestras/shared/data-model";
import { ToastService } from "@pestras/frontend/ui";

@Component({
  selector: 'pestras-workflow-form',
  templateUrl: './workflow-form.view.html'
})
export class WorkflowFormViewComponent {

  readonly form = new FormGroup<WorkflowFormModel>({
    blueprint: new FormControl('', { nonNullable: true }),
    cancelable: new FormControl(false, { nonNullable: true }),
    default_action: new FormControl(WorkflowAction.APPROVE, { nonNullable: true }),
    max_review_days: new FormControl(5, { nonNullable: true, validators: Validators.min(1) }),
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    steps: new FormArray([new FormGroup<WorkflowStepOptionsFormModel>({
      serial: new FormControl('', { nonNullable: true }),
      users: new FormControl([], { nonNullable: true, validators: Validators.required }),
      algo: new FormControl(WorkflowStepAlgo.ANY, { nonNullable: true })
    })])
  });

  readonly steps = this.form.controls.steps;

  loading = false;

  @Input({ required: true })
  blueprint!: string;

  @Output()
  done = new EventEmitter<Workflow>();
  @Output()
  cancel = new EventEmitter();

  constructor(
    private state: WorkflowsState,
    private toast: ToastService
  ) { }

  addStep() {
    this.steps.push(new FormGroup<WorkflowStepOptionsFormModel>({
      serial: new FormControl('', { nonNullable: true }),
      users: new FormControl([], { nonNullable: true, validators: Validators.required }),
      algo: new FormControl(WorkflowStepAlgo.ANY, { nonNullable: true })
    }));
  }

  mapUser(u: User) {
    return { name: u.fullname, value: u.serial };
  }

  filterAlgo(algo: { value: WorkflowStepAlgo }, users: string[]) {
    return !!(users.length % 2 && algo.value !== WorkflowStepAlgo.MOST);
  }

  create(c: Record<string, any>) {
    this.loading = true;

    this.form.controls.blueprint.setValue(this.blueprint);
    
    this.state.create(this.form.getRawValue())
      .subscribe({
        next: wf => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.done.emit(wf);
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.loading = false;
        }
      })
  }
}