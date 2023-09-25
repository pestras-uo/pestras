import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordWorkflowStateViewComponent } from './views/record-workflow-state/record-workflow-state.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiDropdown, PuiIcon, PuiPreloaderModule } from '@pestras/frontend/ui';
import { RecordWorkflowPipe } from './pipes/record-workflow.pipe';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { DialogModule } from '@angular/cdk/dialog';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RecordWorkflowStateViewComponent,
    RecordWorkflowPipe
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiIcon,
    PuiPreloaderModule,
    PuiDropdown,
    // Features
    SessionFeatureModule,
    // widgets
    AvatarWidget
  ],
  exports: [RecordWorkflowStateViewComponent]
})
export class RecordsWorkflowFeatureModule {}
