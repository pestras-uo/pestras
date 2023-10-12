import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordWorkflowStateViewComponent } from './views/record-workflow-state/record-workflow-state.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiDropdown, PuiIcon, PuiPreloaderModule } from '@pestras/frontend/ui';
import { RecordWorkflowPipe } from './pipes/record-workflow.pipe';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { DialogModule } from '@angular/cdk/dialog';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecordActiveWorkflowPipe } from './pipes/record-active-workflow.pipe';
import { RecordWorkflowViewComponent } from './views/record-workflow/record-workflow.component';

@NgModule({
  declarations: [
    RecordWorkflowStateViewComponent,
    RecordWorkflowViewComponent,
    RecordWorkflowPipe,
    RecordActiveWorkflowPipe
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
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
    AvatarWidget,
    NoDataPlaceholderWidget
  ],
  exports: [
    RecordWorkflowStateViewComponent,
    RecordWorkflowViewComponent,
    RecordActiveWorkflowPipe
  ]
})
export class RecordsWorkflowFeatureModule {}
