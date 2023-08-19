import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { DashboardsRouter } from './dashboards.router';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DetailsPage } from './details/details.page';
import { DialogModule } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SideMenuView } from './views/side-menu/side-menu.view';
import { AccessView } from './views/access/access.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiIcon, PuiImageInput, PuiPreloaderModule, PuiSelectInput, PuiSideDrawerModule, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { TBgWidget } from '@pestras/frontend/widgets/t-bg';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { DataVizFeatureModule } from '@pestras/frontend/features/data-viz';
import { ContentViewsFeatureModule } from '@pestras/frontend/features/content-views';
import { DashboardsFeaturesModule } from '@pestras/frontend/features/dashboards';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { UsersGroupsFeatureModule } from '@pestras/frontend/features/users-groups';
import { SessionFeatureModule } from '@pestras/frontend/features/session';


@NgModule({
  declarations: [
    DashboardsRouter,
    DetailsPage,
    SideMenuView,
    AccessView
  ],
  imports: [
    // Angular
    CommonModule,
    DashboardsRoutingModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    DragDropModule,
    // Pui
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    PuiSideDrawerModule,
    PuiImageInput,
    PuiUtilPipesModule,
    // Widgets
    QuillModule,
    TBgWidget,
    NoDataPlaceholderWidget,
    AvatarWidget,
    // Features
    DataVizFeatureModule,
    ContentViewsFeatureModule,
    DashboardsFeaturesModule,
    WorkspaceFeatureModule,
    OrgunitsFeatureModule,
    UsersFeatureModule,
    UsersGroupsFeatureModule,
    SessionFeatureModule
  ]
})
export class DashboardsModule { }
