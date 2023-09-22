import { Injectable } from "@angular/core";
import { StatorChannel, StatorGroupState } from "@pestras/frontend/util/stator";
import { Workflow, WorkflowAction, WorkflowStepOptions } from "@pestras/shared/data-model";
import { WorkflowsService } from "./workflows.service";
import { SessionEnd } from "../session/session.events";
import { Observable, tap } from "rxjs";
import { CreateWorkflowInput } from "@pestras/backend/models";

@Injectable()
export class WorkflowsState extends StatorGroupState<Workflow> {

  constructor(
    private service: WorkflowsService,
    private channel: StatorChannel
  ) {
    super('workflows', 'serial', 'blueprint', ['1h']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetch(serial: string): Observable<Workflow | null> {
    return this.service.getBySerial({ serial });
  }

  protected override _fetchGroup(blueprint: string): Observable<Workflow[]> {
    return this.service.getByBlueprint({ blueprint });
  }

  create(data: CreateWorkflowInput) {
    return this.service.create(data)
      .pipe(tap(w => this._insert(w)));
  }

  updateName(serial: string, name: string) {
    return this.service.updateName({ serial }, { name })
      .pipe(tap(() => this._update(serial, { name })));
  }

  updateMaxReviewDays(serial: string, days: number) {
    return this.service.updateMaxReviewDays({ serial }, { days })
      .pipe(tap(() => this._update(serial, { max_review_days: days })));
  }

  updateDefaultAction(serial: string, action: Exclude<WorkflowAction, WorkflowAction.REVIEW>) {
    return this.service.updateDefaultAction({ serial }, { action })
      .pipe(tap(() => this._update(serial, { default_action: action })))
  }

  updateCancelable(serial: string, cancelable: boolean) {
    return this.service.updateCancelable({ serial }, { cancelable })
      .pipe(tap(() => this._update(serial, { cancelable })))
  }

  updateSteps(serial: string, steps: WorkflowStepOptions[]) {
    return this.service.updateSteps({ serial }, { steps })
      .pipe(tap(() => this._update(serial, { steps })))
  }
}