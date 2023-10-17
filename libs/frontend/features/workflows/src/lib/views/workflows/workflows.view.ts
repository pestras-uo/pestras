/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from '@pestras/frontend/ui';
import { Workflow } from '@pestras/shared/data-model';
import { WorkflowsState } from 'libs/frontend/state/src/lib/workflows/workflows.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'pestras-workflows',
  templateUrl: './workflows.view.html',
  styleUrls: ['./workflows.view.scss'],
})
export class WorkflowsViewComponent implements OnInit {
  isEmpty = false;
  form = false;
  selected: Workflow | null = null;
  list$!: Observable<Workflow[]>;
  loading = false;
  dialogRef: DialogRef | null = null;
  activeWf: Workflow | null = null;

  readonly nameCtrl = new FormControl<string>('', { nonNullable: true, validators: Validators.required });

  @Input({ required: true })
  blueprint!: string;
  @Input()
  editable = false;

  constructor(
    private state: WorkflowsState,
    private dialog: Dialog,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.list$ = this.state.selectGroup(this.blueprint);
  }

  openDialog(tmp: TemplateRef<unknown>, wf: Workflow) {
    this.activeWf = wf;
    this.nameCtrl.setValue(wf.name);
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.nameCtrl.reset();
    this.activeWf = null;
    this.loading = false;
  }

  updateName(c: Record<string, any>) {

    if (!this.activeWf)
      return;
    
    this.loading = true;

    this.state.updateName(this.activeWf.serial, this.nameCtrl.value)
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
