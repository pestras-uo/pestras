import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, OnChanges, TemplateRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RecordsService, SessionState } from "@pestras/frontend/state";
import { untilDestroyed } from "@pestras/frontend/ui";
import { DataRecordState, DataStore, RecordWorkflow, WorkflowState, WorkflowTriggers } from "@pestras/shared/data-model";
import { RecordsWorkflowService } from "libs/frontend/state/src/lib/record-workflow/records-workflow.service";
import { Observable } from "rxjs";

@Component({
  selector: 'pestras-record-workflow-state',
  templateUrl: './record-workflow-state.view.html'
})
export class RecordWorkflowStateViewComponent implements OnChanges {
  readonly ud = untilDestroyed();
  readonly user = this.session.get()?.serial;
  readonly publishMessageCtrl = new FormControl('');
  readonly icons: Record<WorkflowState, string> = {
    approve: 'check',
    reject: 'close',
    review: 'time'
  }

  activeWF$!: Observable<RecordWorkflow | null>;
  loading = false;
  hasPublishedVersion = false;
  dialogRef: DialogRef | null = null;
  hasWorkflow = false;
  trigger!: WorkflowTriggers;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  record!: string;
  @Input({ required: true })
  rState!: DataRecordState;
  @Input()
  editable = false;

  constructor(
    private service: RecordsWorkflowService,
    private recordsService: RecordsService,
    private session: SessionState,
    private dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnChanges(): void {
    this.getWorkflowStack();



    if (this.rState === 'published')
      this.hasPublishedVersion = true;
    else
      this.recordsService.getBySerial({ ds: this.dataStore.serial, serial: this.record })
        .pipe(this.ud())
        .subscribe(res => this.hasPublishedVersion = !!res);

    const hasCreateWorkflow = typeof this.dataStore.settings.workflow.create === 'string';
    const hasUpdateWorkflow = typeof this.dataStore.settings.workflow.update === 'string';

    this.trigger = this.hasPublishedVersion ? 'update' : 'create';
    this.hasWorkflow = this.trigger === 'create' ? hasCreateWorkflow : hasUpdateWorkflow;

  }

  toWorkflow() {
    this.router.navigate([], { relativeTo: this.route, queryParamsHandling: "merge", queryParams: { menu: 'workflow' } })
  }

  openDialog(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.loading = false;
  }

  getWorkflowStack() {
    this.activeWF$ = this.service.getRecordActiveWF({ ds: this.dataStore.serial, record: this.record, });
  }

  publish() {
    const message = this.publishMessageCtrl.value ?? '';

    this.loading = true;

    this.service.publish({ ds: this.dataStore.serial, record: this.record, trigger: this.trigger }, { message })
      .subscribe({
        next: () => {
          this.getWorkflowStack();
          this.router.navigate([], { relativeTo: this.route, queryParams: { state: this.hasWorkflow ? 'review' : 'published' } });
          this.closeDialog();
        },
        error: error => {
          console.error(error);
          this.loading = false;
        }
      });
  }
}