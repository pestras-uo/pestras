import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, OnChanges, TemplateRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ToastService } from "@pestras/frontend/ui";
import { Workflow } from "@pestras/shared/data-model";
import { WorkflowsState } from "libs/frontend/state/src/lib/workflows/workflows.state";

@Component({
  selector: 'pestras-workflow-cancelable',
  templateUrl: './workflow-cancelable.view.html'
})
export class WorkflowCanelableViewComponent implements OnChanges {

  readonly ctrl = new FormControl<boolean>(false, { nonNullable: true });

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
    this.ctrl.setValue(this.wf.cancelable);
  }

  openDialog(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.ctrl.setValue(this.wf.cancelable);
    this.loading = false;
  }

  update(successMsg: string, errMsgs: Record<string, string>) {
    this.loading = true;

    this.state.updateCancelable(this.wf.serial, this.ctrl.value)
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