import { Component, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { WorkflowStepOptionsFormModel } from "../workflow-form/workflow-form.model";
import { User, Workflow, WorkflowStepAlgo, WorkflowStepOptions } from "@pestras/shared/data-model";
import { WorkflowsState } from "libs/frontend/state/src/lib/workflows/workflows.state";
import { ToastService } from "@pestras/frontend/ui";

@Component({
  selector: 'pestras-workflow-steps',
  templateUrl: './workflow-steps.view.html'
})
export class WorkflowStepsViewComponent {

  readonly form = new FormGroup({
    steps: new FormArray<FormGroup<WorkflowStepOptionsFormModel>>([])
  });

  readonly steps = this.form.controls.steps;

  editMode = false;
  loading = false;

  @Input({ required: true })
  wf!: Workflow;

  constructor(
    private state: WorkflowsState,
    private toast: ToastService
  ) { }

  edit() {
    for (const step of this.wf.steps)
      this.addStep(step);
    this.editMode = true;
  }

  endEdit() {
    this.editMode = false;
    this.steps.clear();
    this.loading = false;
  }

  mapUser(u: User) {
    return { name: u.username, value: u.serial };
  }

  filterAlgo(algo: { value: WorkflowStepAlgo }, users: string[]) {
    return !!(users.length % 2) || algo.value !== WorkflowStepAlgo.MOST;
  }

  addStep(step?: WorkflowStepOptions) {
    this.steps.push(new FormGroup<WorkflowStepOptionsFormModel>({
      serial: new FormControl(step?.serial ?? '', { nonNullable: true }),
      users: new FormControl(step?.users ?? [], { nonNullable: true, validators: Validators.required }),
      algo: new FormControl(step?.algo ?? WorkflowStepAlgo.ANY, { nonNullable: true })
    }));
  }

  update(successMsg: string, errMsgs: Record<string, string>) {
    this.loading = true;

    this.state.updateSteps(this.wf.serial, this.form.getRawValue().steps)
      .subscribe({
        next: () => {
          this.toast.msg(successMsg, { type: 'success' });
          this.endEdit();
        },
        error: e => {
          console.error(e);
          this.toast.msg(errMsgs[e?.error] || errMsgs['default'], { type: 'error' });
          this.loading = false;
        }
      })
  }

}