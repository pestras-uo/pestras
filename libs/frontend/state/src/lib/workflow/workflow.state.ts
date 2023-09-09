import { Injectable } from '@angular/core';
import { RecordWorkflow } from '@pestras/shared/data-model';
import { StatorChannel, StatorQueryState } from '@pestras/frontend/util/stator';
import { WorkflowService } from './workflow.service';
import { SessionEnd } from '../session/session.events';

@Injectable({ providedIn: 'root' })
export class WorkflowState extends StatorQueryState<RecordWorkflow> {

  constructor(
    private service: WorkflowService,
    private channel: StatorChannel
  ) {
    super('workflow', 'record', ['10m']);

    this.channel.select(SessionEnd)
      .subscribe(() => this._clear());
  }

  protected override _fetchDoc(record: string, ds: string) {
    return this.service.getByEntity({ ds, record });
  }

  publish(ds: string, record: string) {
    return this.service.publish({ ds, record });
  }

  approve(ds: string, record: string) {
    return this.service.approve({ ds, record });
  }

  cancel(ds: string, record: string) {
    return this.service.approve({ ds, record });
  }
}