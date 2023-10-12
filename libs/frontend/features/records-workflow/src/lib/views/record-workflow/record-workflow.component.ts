import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { Component, Input, OnChanges, TemplateRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RecordsService, SessionState } from "@pestras/frontend/state";
import { untilDestroyed } from "@pestras/frontend/ui";
import { DataRecordState, RecordWorkflowState, WorkflowState, WorkflowTriggers } from "@pestras/shared/data-model";
import { RecordsWorkflowService } from "libs/frontend/state/src/lib/record-workflow/records-workflow.service";
import { Observable, map } from "rxjs";

@Component({
  selector: 'pestras-record-workflow',
  templateUrl: './record-workflow.component.html'
})
export class RecordWorkflowViewComponent implements OnChanges {
  private ud = untilDestroyed();

  readonly user = this.session.get()?.serial;
  readonly publishMessageCtrl = new FormControl('');
  readonly icons: Record<WorkflowState, string> = {
    approve: 'check',
    reject: 'close',
    review: 'time'
  }

  workflow$!: Observable<RecordWorkflowState | null>;
  preAction: WorkflowState | null = null;
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
    this.getWorkflow();

    if (this.rState === 'published')
      this.hasPublishedVersion = true;
    else
      this.recordsService.getBySerial({ ds: this.dataStore, serial: this.record })
        .pipe(this.ud())
        .subscribe(res => this.hasPublishedVersion = !!res);
  }

  getWorkflow() {
    this.workflow$ = this.service.getByRecord({ ds: this.dataStore, record: this.record })
      .pipe(
        map(wf => {
          if (!wf)
            return null

          wf.workflows.reverse();

          return wf;
        })
      );
  }

  openDialog(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeDialog() {
    this.dialogRef?.close();
    this.dialogRef = null;
    this.loading = false;
  }

  prepareAction(action: WorkflowState | null) {
    this.preAction = action;
  }

  publish() {
    const trigger: WorkflowTriggers = this.hasPublishedVersion ? 'update' : 'create';

    this.loading = true;
    const message = this.publishMessageCtrl.value ?? '';

    this.service.publish({ ds: this.dataStore, record: this.record, trigger }, { message })
      .subscribe({
        next: () => {
          this.getWorkflow();
          this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'review' } });
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

    this.service.approve({ ds: this.dataStore, record: this.record, step }, { message })
      .subscribe({
        next: res => {

          if (res === 'published')
            this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'published' } });
          if (res === null)
            this.router.navigate(['/main']);

          this.getWorkflow();
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

    this.service.reject({ ds: this.dataStore, record: this.record, step }, { message })
      .subscribe({
        next: res => {
          if (res === 'published')
            this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'published' } });
          if (res === 'draft')
            this.router.navigate([], { relativeTo: this.route, queryParams: { state: 'draft' } });

          this.getWorkflow();
          this.loading = false;
        },
        error: error => {
          console.error(error);
          this.loading = false;
        }
      });
  }
}