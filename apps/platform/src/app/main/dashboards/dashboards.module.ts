import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { DashboardsRouterComponent } from './dashboards.router';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DetailsPageComponent } from './details/details.page';
import { DialogModule } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SideMenuViewComponent } from './views/side-menu/side-menu.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import {
  PuiIcon,
  PuiImageInput,
  PuiInfiniteScroll,
  PuiPreloaderModule,
  PuiSelectInput,
  PuiSideDrawerModule,
  PuiTableModule,
  PuiUtilPipesModule,
} from '@pestras/frontend/ui';
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
import { MainPageComponent } from './main/main.page';
import { EntityAccessFeatureModule } from '@pestras/frontend/features/entity-access';
import { AppBreadCrumbModule } from '@pestras/frontend/widgets/bread-crumb';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { TopicsFeatureModule } from '@pestras/frontend/features/topics';

@NgModule({
  declarations: [
    DashboardsRouterComponent,
    DetailsPageComponent,
    SideMenuViewComponent,
    MainPageComponent,
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
    PuiInfiniteScroll,
    PuiTableModule,
    // Widgets
    AppBreadCrumbModule,
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
    SessionFeatureModule,
    EntityAccessFeatureModule,
    DataStoresFeatureModule,
    TopicsFeatureModule,

  ],
})
export class DashboardsModule {}
