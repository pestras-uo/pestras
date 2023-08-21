import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsApiRoutingModule } from './clients-api-routing.module';
import { ClientsApiPage } from './clients-api.page';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { DataStoresView } from './views/data-stores/data-stores.view';
import { ParamsView } from './views/params/params.view';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiCheckInput, PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { BlueprintsFeatureModule } from '@pestras/frontend/features/blueprints';
import { SessionFeatureModule } from '@pestras/frontend/features/session';


@NgModule({
  declarations: [
    ClientsApiPage,
    DataStoresView,
    ParamsView
  ],
  imports: [
    // Angular
    CommonModule,
    ClientsApiRoutingModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiIcon,
    PuiSelectInput,
    PuiPreloaderModule,
    PuiCheckInput,
    PuiUtilPipesModule,
    // Widgets
    NoDataPlaceholderWidget,
    // features
    DataStoresFeatureModule,
    BlueprintsFeatureModule,
    SessionFeatureModule
  ]
})
export class ClientsApiModule { }
