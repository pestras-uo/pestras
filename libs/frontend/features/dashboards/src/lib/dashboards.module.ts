import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicDashboardsListView } from './views/topics-dashboards-list/topics-dashboards-list.view';
import { RouterModule } from '@angular/router';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { ReactiveFormsModule } from '@angular/forms';
import { PuiCheckInput, PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { DialogModule } from '@angular/cdk/dialog';
import { DashboardSlideComponent } from './views/dashboard-slide/dashboard-slide.view';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataVizFeatureModule } from '@pestras/frontend/features/data-viz';
import { DashboardPipe } from './pipes/dashboard.pipe';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { ContraModule } from '@pestras/frontend/util/contra';
import { StateModule } from '@pestras/frontend/state';
import { DashboardsPipe } from './pipes/dashboards.pipe';
import { ContentViewsFeatureModule } from '@pestras/frontend/features/content-views';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';



@NgModule({
  declarations: [
    TopicDashboardsListView,
    DashboardSlideComponent,
    DashboardPipe,
    DashboardsPipe
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // state
    StateModule,
    // Util
    ContraModule,
    DialogModule,
    DragDropModule,
    // Widgets
    NoDataPlaceholderWidget,
    AvatarWidget,
    // Pui
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    PuiUtilPipesModule,
    PuiCheckInput,
    // Features
    DataVizFeatureModule,
    WorkspaceFeatureModule,
    ContentViewsFeatureModule
  ],
  exports: [
    TopicDashboardsListView,
    DashboardSlideComponent,
    DashboardPipe,
    DashboardsPipe
  ]
})
export class DashboardsFeaturesModule { }
