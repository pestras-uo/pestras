import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoresRoutingModule } from './data-stores-routing.module';
import { DataStoresRouter } from './data-stores.router';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DataStoreDetailsPage } from './details/details.page';
import { DetailsSideMenuView } from './views/side-menu/side-menu.view';
import { FieldsListView } from './views/fields-list/fields-list.view';
import { AggregationSettingsView } from './views/aggregation-settings/aggregation-settings.view';
import { CollaboratorsView } from './views/collaborators/collaborators.view';
import { DialogModule } from '@angular/cdk/dialog';
import { WebServiceSettingsView } from './views/web-service-settings/web-service-settings.view';
import { GeneralView } from './views/web-service-settings/general/general.view';
import { AuthView } from './views/web-service-settings/auth/auth.view';
import { HeadersView } from './views/web-service-settings/headers/headers.view';
import { ParamsView } from './views/web-service-settings/params/params.view';
import { SelectionView } from './views/web-service-settings/selection/selection.view';
import { RecordsView } from './views/records/records.view';
import { TableSettingsView } from './views/table-settings/table-settings.view';
import { ContentViewsFeatureModule } from '@pestras/frontend/features/content-views';
import { AggregationFeatureModule } from '@pestras/frontend/features/aggregation';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { RecordsFeatureModule } from '@pestras/frontend/features/data-records';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { ContraModule } from '@pestras/frontend/util/contra';
import {
  PuiCheckInput,
  PuiHint,
  PuiIcon,
  PuiInfiniteScroll,
  PuiMultiSelectInput,
  PuiPreloaderModule,
  PuiSelectInput,
  PuiSideDrawerModule,
  PuiTableModule,
  PuiUtilPipesModule,
} from '@pestras/frontend/ui';
import { TBgWidget } from '@pestras/frontend/widgets/t-bg';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { WorkflowsFeatureModule } from '@pestras/frontend/features/workflows';
import { AppBreadCrumbModule } from '@pestras/frontend/widgets/bread-crumb';
import { RelationsSettingsComponent } from './views/relations-settings/relations-settings.view';
import { AddRelationModalComponent } from './modals/add-relation/add-relation.modal.component';
import { AddRelationChartModalComponent } from './modals/add-relation-chart/add-relation-chart.modal.component';
import { DataVizFeatureModule } from '@pestras/frontend/features/data-viz';

@NgModule({
  declarations: [
    DataStoresRouter,
    DataStoreDetailsPage,
    DetailsSideMenuView,
    TableSettingsView,
    FieldsListView,
    AggregationSettingsView,
    CollaboratorsView,
    WebServiceSettingsView,
    GeneralView,
    AuthView,
    HeadersView,
    ParamsView,
    SelectionView,
    RecordsView,
    RelationsSettingsComponent,
    AddRelationModalComponent,
    AddRelationChartModalComponent
  ],
  imports: [
    // Angular
    CommonModule,
    DataStoresRoutingModule,
    ReactiveFormsModule,
    // Features
    AggregationFeatureModule,
    ContentViewsFeatureModule,
    WorkspaceFeatureModule,
    DataStoresFeatureModule,
    RecordsFeatureModule,
    SessionFeatureModule,
    WorkflowsFeatureModule,
    DataVizFeatureModule,
    // Util
    ContraModule,
    PuiUtilPipesModule,
    DialogModule,
    // PUI
    PuiIcon,
    PuiPreloaderModule,
    PuiSelectInput,
    PuiMultiSelectInput,
    PuiUtilPipesModule,
    PuiHint,
    PuiCheckInput,
    PuiTableModule,
    PuiInfiniteScroll,
    PuiSideDrawerModule,
    // Widgets
    TBgWidget,
    NoDataPlaceholderWidget,
    QuillModule,
    AvatarWidget,
    AppBreadCrumbModule,
  ],
})
export class DataStoresModule {}
