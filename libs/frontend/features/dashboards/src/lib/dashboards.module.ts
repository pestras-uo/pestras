import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardsListView } from './views/dashboards-list/dashboards-list.view';
import { RouterModule } from '@angular/router';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { ReactiveFormsModule } from '@angular/forms';
import { PuiIcon, PuiPreloaderModule, PuiSelectInput } from '@pestras/frontend/ui';
import { DialogModule } from '@angular/cdk/dialog';
import { DashboardSlideComponent } from './views/dashboard-slide/dashboard-slide.view';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataVizFeatureModule } from '@pestras/frontend/features/data-viz';
import { DashboardPipe } from './pipes/dashboard.pipe';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { ContraModule } from '@pestras/frontend/util/contra';
import { StateModule } from '@pestras/frontend/state';



@NgModule({
  declarations: [
    DashboardsListView,
    DashboardSlideComponent,
    DashboardPipe
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
    // Pui
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    // Features
    DataVizFeatureModule,
    WorkspaceFeatureModule
  ],
  exports: [
    DashboardsListView,
    DashboardSlideComponent,
    DashboardPipe
  ]
})
export class DashboardsFeaturesModule { }
