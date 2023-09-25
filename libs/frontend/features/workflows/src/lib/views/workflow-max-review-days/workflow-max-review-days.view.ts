import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, OnChanges, TemplateRef } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ToastService } from "@pestras/frontend/ui";
import { Workflow } from "@pestras/shared/data-model";
import { WorkflowsState } from "libs/frontend/state/src/lib/workflows/workflows.state";

@Component({
  selector: 'pestras-workflow-max-review-days',
  templateUrl: './workflow-max-review-days.view.html'
})
export class WorkflowMaxReviewDaysViewComponent implements OnChanges {

  readonly daysCtrl = new FormControl<number>(
    5, 
    { 
      nonNullable: true, 
      validators: [Validators.required, Validators.min(1)] 
    }
  );

  loading = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  wf!: Workflow;

  constructor(
    private state: WorkflowsState,
    private dialog: Dialog,
    private toast: ToastService
  ) {}

  ngOnChanges(): void {
    this.daysCtrl.setValue(this.wf.max_review_days);
  }

  openDialog(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.daysCtrl.setValue(this.wf.max_review_days);
    this.loading = false;
  }

  update(successMsg: string, errMsgs: Record<string, string>) {
    this.loading = true;

    this.state.updateMaxReviewDays(this.wf.serial, this.daysCtrl.value)
      .subscribe({
        next: () => {
          this.toast.msg(successMsg, { type: 'success' });
          this.closeDialog();
        },
        error: e => {
          console.error(e);
          this.toast.msg(errMsgs[e?.error] || errMsgs['default'], { type: 'error' });
          this.loading = false;
        }
      })
  }
}