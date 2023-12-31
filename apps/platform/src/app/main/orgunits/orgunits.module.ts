import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgunitsRoutingModule } from './orgunits-routing.module';
import { OrgunitsPage } from './orgunits.page';
import { OrgunitsListView } from './views/orgunits-list/orgunits-list.view';
import {
  PuiIcon,
  PuiImageInput,
  PuiTableModule,
  PuiPreloaderModule,
  PuiSelectInput,
  PuiUtilPipesModule,
  PuiMultiSelectInput,
} from '@pestras/frontend/ui';
import { ContraModule } from '@pestras/frontend/util/contra';
import { OrgunitDetailsView } from './views/orgunit-details/orgunit-details.view';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateOrgunitModal } from './modals/create-orgunit/create-orgunit.modal';
import { NgxEchartsModule } from 'ngx-echarts';
import { HierarchyChart } from './charts/hierarchy/hierarchy.chart';
import { UpdateOrgunitModal } from './modals/update-orgunit/update-orgunit.modal';
import { UpdateOrgunitLogoModal } from './modals/update-orgunit-logo/update-orgunit-logo.modal';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { DialogModule } from '@angular/cdk/dialog';
import { RegionsFeatureModule } from '@pestras/frontend/features/regions';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { OrgunitsTableView } from './views/orgunits-table/orgunits-table.view';
import { RegionsTableView } from './views/regions-table/regions-table.view';

@NgModule({
  declarations: [
    OrgunitsPage,
    OrgunitsListView,
    OrgunitDetailsView,
    CreateOrgunitModal,
    HierarchyChart,
    UpdateOrgunitModal,
    UpdateOrgunitLogoModal,
    OrgunitsTableView,
    RegionsTableView
  ],
  imports: [
    // Angular
    CommonModule,
    OrgunitsRoutingModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiIcon,
    PuiSelectInput,
    PuiMultiSelectInput,
    PuiPreloaderModule,
    PuiImageInput,
    PuiUtilPipesModule,
    PuiTableModule,
    // Widgets
    NgxEchartsModule,
    NoDataPlaceholderWidget,
    // features
    RegionsFeatureModule,
    OrgunitsFeatureModule,
    UsersFeatureModule,
  ],
})
export class OrgunitsModule {}
