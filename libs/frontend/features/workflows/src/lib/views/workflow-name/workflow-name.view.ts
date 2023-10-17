/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, OnChanges, TemplateRef } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ToastService } from "@pestras/frontend/ui";
import { Workflow } from "@pestras/shared/data-model";
import { WorkflowsState } from "libs/frontend/state/src/lib/workflows/workflows.state";

@Component({
  selector: 'pestras-workflow-name',
  templateUrl: './workflow-name.view.html',
  styles: [`
    :host { display: block; }
  `]
})
export class WorkflowNameViewComponent implements OnChanges {

  readonly nameCtrl = new FormControl<string>('', { nonNullable: true, validators: Validators.required });

  loading = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  wf!: Workflow

  constructor(
    private state: WorkflowsState,
    private dialog: Dialog,
    private toast: ToastService
  ) {}

  ngOnChanges(): void {
    this.nameCtrl.setValue(this.wf.name);
  }

  openDialog(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.nameCtrl.setValue(this.wf.name);
    this.loading = false;
  }

  updateName(c: Record<string, any>) {
    this.loading = true;

    this.state.updateName(this.wf.serial, this.nameCtrl.value)
      .subscribe({
        next: () => {
          this.toast.msg(c['success'].default, { type: 'success' });
          this.closeDialog();
        },
        error: e => {
          console.error(e);

          this.toast.msg(c['errors'][e?.error] || c['errors'].default, { type: 'error' });
          this.loading = false;
        }
      })
  }
}