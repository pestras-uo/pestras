/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { SessionState } from '@pestras/frontend/state';
import { DataStore, Role, WorkflowState } from '@pestras/shared/data-model';

@Component({
  selector: 'app-data-stores-records',
  templateUrl: './data-stores-records.view.html',
  styles: [
  ]
})
export class DataStoresRecordsView implements OnChanges {
  readonly workflow = WorkflowState;

  tab: WorkflowState = WorkflowState.APPROVED;
  search: any = { workflow: WorkflowState.APPROVED };
  canAdd!: boolean;

  @Input({ required: true })
  topic!: string;
  @Input({ required: true })
  dataStore!: DataStore;

  constructor(private session: SessionState) {}

  ngOnChanges() {
    const session = this.session.get();
    this.canAdd = this.dataStore.collaborators.length
      ? this.dataStore.collaborators.includes(session?.serial ?? '')
      : !!session?.roles.includes(Role.AUTHOR);
  }

  setTab(t: WorkflowState) {
    if (this.tab === t)
      return;

    this.tab = t;
    if (t !== WorkflowState.APPROVED)
      this.search = { workflow: t, owner: this.session.get('serial') }
    else
      this.search = { workflow: t };
  }
}
