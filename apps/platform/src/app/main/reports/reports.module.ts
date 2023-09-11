import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsRouter } from './reports.router';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DialogModule } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DetailsPage } from './details/details.page';
import { SideMenuView } from './views/side-menu/side-menu.view';
import { AccessView } from './views/access/access.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import { TBgWidget } from '@pestras/frontend/widgets/t-bg';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { ContentViewsFeatureModule } from '@pestras/frontend/features/content-views';
import { ReportsFeaturesModule } from '@pestras/frontend/features/reports';
import { DataVizFeatureModule } from '@pestras/frontend/features/data-viz';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { UsersGroupsFeatureModule } from '@pestras/frontend/features/users-groups';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { ExportToPdfDirective, PuiIcon, PuiImageInput, PuiPreloaderModule, PuiSelectInput, PuiSideDrawerModule, PuiUtilPipesModule } from '@pestras/frontend/ui';


@NgModule({
  declarations: [
    ReportsRouter,
    DetailsPage,
    SideMenuView,
    AccessView
  ],
  imports: [
    // angular
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    // util
    ContraModule,
    QuillModule,
    DialogModule,
    DragDropModule,
    // widgets
    TBgWidget,
    NoDataPlaceholderWidget,
    AvatarWidget,
    // features
    ContentViewsFeatureModule,
    ReportsFeaturesModule,
    DataVizFeatureModule,
    WorkspaceFeatureModule,
    OrgunitsFeatureModule,
    UsersFeatureModule,
    UsersGroupsFeatureModule,
    SessionFeatureModule,
    // pui
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    PuiSideDrawerModule,
    PuiImageInput,
    PuiUtilPipesModule,
    ExportToPdfDirective
  ]
})
export class ReportsModule { }
