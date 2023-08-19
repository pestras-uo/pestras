import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspacePage } from './workspace.page';
import { PinsView } from './views/pins/pins.view';
import { SlidesView } from './views/slides/slides.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { PuiIcon, PuiPreloaderModule, PuiSelectInput } from '@pestras/frontend/ui';
import { DashboardsFeaturesModule } from '@pestras/frontend/features/dashboards';
import { ReportsFeaturesModule } from '@pestras/frontend/features/reports';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';


@NgModule({
  declarations: [
    WorkspacePage,
    PinsView,
    SlidesView
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    ReactiveFormsModule,
    ContraModule,
    DialogModule,
    PuiPreloaderModule,
    DashboardsFeaturesModule,
    ReportsFeaturesModule,
    PuiIcon,
    PuiSelectInput,
    NoDataPlaceholderWidget
  ]
})
export class WorkspaceModule { }
