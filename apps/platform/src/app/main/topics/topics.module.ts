import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicsRoutingModule } from './topics-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TopicsRouter } from './topics.router';
import { DetailsPage } from './details/details.page';
import { DialogModule } from '@angular/cdk/dialog';
import { SideMenuView } from './views/side-menu/side-menu.view';
import { DataStoresListView } from './views/data-stores-list/data-stores-list.view';
import { MainPage } from './main/main.page';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PubSubModule, PuiIcon, PuiInfiniteScroll, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { ContentViewsFeatureModule } from '@pestras/frontend/features/content-views';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { TopicsFeatureModule } from '@pestras/frontend/features/topics';
import { DashboardsFeaturesModule } from '@pestras/frontend/features/dashboards';
import { ReportsFeaturesModule } from '@pestras/frontend/features/reports';
import { RecordsFeatureModule } from '@pestras/frontend/features/data-records';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { BlueprintsFeatureModule } from '@pestras/frontend/features/blueprints';
import { UsersGroupsFeatureModule } from '@pestras/frontend/features/users-groups';
import { EntityAccessFeatureModule } from '@pestras/frontend/features/entity-access';
import { TopicsListViewComponent } from './views/topics-list/topics-list.view';


@NgModule({
  declarations: [
    TopicsRouter,
    DetailsPage,
    TopicsListViewComponent,
    SideMenuView,
    DataStoresListView,
    MainPage
  ],
  imports: [
    // Angular
    CommonModule,
    TopicsRoutingModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    PubSubModule,
    // PUI
    PuiPreloaderModule,
    PuiIcon,
    PuiInfiniteScroll,
    PuiUtilPipesModule,
    PuiSelectInput,
    // Widgets
    ContentViewsFeatureModule,
    NoDataPlaceholderWidget,
    // Features
    TopicsFeatureModule,
    DashboardsFeaturesModule,
    ReportsFeaturesModule,
    RecordsFeatureModule,
    WorkspaceFeatureModule,
    DataStoresFeatureModule,
    OrgunitsFeatureModule,
    UsersFeatureModule,
    UsersGroupsFeatureModule,
    SessionFeatureModule,
    BlueprintsFeatureModule,
    EntityAccessFeatureModule
  ]
})
export class TopicsModule { }
