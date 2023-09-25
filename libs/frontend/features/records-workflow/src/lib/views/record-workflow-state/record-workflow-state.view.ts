import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, OnChanges, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RecordsService, SessionState } from "@pestras/frontend/state";
import { untilDestroyed } from "@pestras/frontend/ui";
import { DataRecordState, RecordWorkflow, WorkflowAction, WorkflowTriggers } from "@pestras/shared/data-model";
import { RecordsWorkflowService } from "libs/frontend/state/src/lib/record-workflow/records-workflow.service";
import { Observable } from "rxjs";

@Component({
  selector: 'pestras-record-workflow-state',
  templateUrl: './record-workflow-state.view.html'
})
export class RecordWorkflowStateViewComponent implements OnChanges {
  readonly drState = DataRecordState;
  readonly wAction = WorkflowAction;
  readonly ud = untilDestroyed();

  readonly user = this.session.get()?.serial;

  readonly icons: Record<WorkflowAction, string> = {
    approve: 'check',
    reject: 'close',
    review: 'time'
  }

  rWorkflow!: Observable<RecordWorkflow[]>;
  preAction: WorkflowAction | null = null;
  loading = false;
  hasPublishedVersion = false;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  dataStore!: string;
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

    if (this.rState === DataRecordState.PUBLISHED)
      this.hasPublishedVersion = true;
    else
      this.recordsService.getBySerial({ ds: this.dataStore, serial: this.record })
        .pipe(this.ud())
        .subscribe(res => this.hasPublishedVersion = !!res);
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
    this.rWorkflow = this.service.getByRecord({ ds: this.dataStore, record: this.record });
  }

  prepareAction(action: WorkflowAction | null) {
    this.preAction = action;
  }

  publish() {
    const trigger: WorkflowTriggers = this.hasPublishedVersion ? 'update' : 'new';

    this.loading = true;

    this.service.publish({ ds: this.dataStore, record: this.record, trigger })
      .subscribe({
        next: () => {
          this.getWorkflowStack();
          this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'preview' } });
          this.closeDialog();
        },
        error: error => {
          console.error(error);
          this.loading = false;
        }
      });
  }

  approve(step: string, message: string) {
    this.loading = true;
    this.preAction = null;

    this.service.approve({ ds: this.dataStore, step }, { message })
      .subscribe({
        next: res => {

          if (res === DataRecordState.PUBLISHED)
            this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'published' } });
          if (res === null)
            this.router.navigate(['/main']);

          this.getWorkflowStack();
          this.loading = false;

        },
        error: error => {
          console.error(error);
          this.loading = false;
        }
      });
  }

  reject(step: string, message: string) {
    this.loading = true;
    this.preAction = null;

    this.service.reject({ ds: this.dataStore, step }, { message })
      .subscribe({
        next: res => {
          if (res === DataRecordState.PUBLISHED)
            this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'published' } });
          if (res === DataRecordState.DRAFT)
            this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'draft' } });

          this.getWorkflowStack();
          this.loading = false;
        },
        error: error => {
          console.error(error);
          this.loading = false;
        }
      });
  }
}