import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiCheckInput, PuiIcon, PuiMultiSelectInput, PuiPreloaderModule, PuiSelectInput, PuiToastModule, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { WorkflowsListViewComponent } from './views/workflows-list/worklfows-list.view';
import { WorkflowsViewComponent } from './views/workflows/workflows.view';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { DialogModule } from '@angular/cdk/dialog';
import { WorkflowNameViewComponent } from './views/workflow-name/workflow-name.view';
import { WorkflowFormViewComponent } from './views/workflow-form/workflow-form.view';
import { UsersFeatureModule } from '@pestras/frontend/features/users'

@NgModule({
  declarations: [
    WorkflowsViewComponent,
    WorkflowFormViewComponent,
    WorkflowsListViewComponent,
    WorkflowNameViewComponent
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
    // features
    UsersFeatureModule
  ],
  exports: [
    WorkflowsViewComponent
  ]
})
export class FrontendFeaturesWorkflowsModule {}
