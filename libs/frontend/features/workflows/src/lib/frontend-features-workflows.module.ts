import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiCheckInput, PuiIcon, PuiMultiSelectInput, PuiPreloaderModule, PuiSelectInput, PuiToastModule, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { WorkflowsListViewComponent } from './views/workflows-list/worklfows-list.view';
import { WorkflowsViewComponent } from './views/workflows/workflows.view';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { DialogModule } from '@angular/cdk/dialog';
import { WorkflowNameViewComponent } from './views/workflow-name/workflow-name.view';
import { WorkflowFormViewComponent } from './views/workflow-form/workflow-form.view';
import { UsersFeatureModule } from '@pestras/frontend/features/users'
import { WorkflowStepsViewComponent } from './views/workflow-steps/workflow-steps.view';
import { WorkflowsPipe } from './pipes/workflows..pipe';

@NgModule({
  declarations: [
    // views
    WorkflowsViewComponent,
    WorkflowFormViewComponent,
    WorkflowsListViewComponent,
    WorkflowNameViewComponent,
    WorkflowStepsViewComponent,
    // pipes
    WorkflowsPipe
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiPreloaderModule,
    PuiSelectInput,
    PuiMultiSelectInput,
    PuiToastModule,
    PuiIcon,
    PuiCheckInput,
    PuiUtilPipesModule,
    // widgets
    NoDataPlaceholderWidget,
    AvatarWidget,
    // features
    UsersFeatureModule
  ],
  exports: [
    // views
    WorkflowsViewComponent,
    // pipes
    WorkflowsPipe
  ]
})
export class WorkflowsFeatureModule {}
