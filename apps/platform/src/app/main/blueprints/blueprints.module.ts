import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlueprintsRoutingModule } from './blueprints-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MainPage } from './main/main.page';
import { BlueprintsRouter } from './blueprints.router';
import { SideMenuView } from './views/side-menu/side-menu.view';
import { DetailsPage } from './details/details.page';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiIcon, PuiPreloaderModule } from '@pestras/frontend/ui';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { TBgWidget } from '@pestras/frontend/widgets/t-bg';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { CategoriesFeatureModule } from '@pestras/frontend/features/categories';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { ClientsApiFeatureModule } from '@pestras/frontend/features/clients-api';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { ContentViewsFeatureModule } from '@pestras/frontend/features/content-views';
import { WorkflowsFeatureModule } from '@pestras/frontend/features/workflows';


@NgModule({
  declarations: [
    MainPage,
    BlueprintsRouter,
    SideMenuView,
    DetailsPage
  ],
  imports: [
    // Angular
    CommonModule,
    BlueprintsRoutingModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    // Features
    WorkflowsFeatureModule,
    ContentViewsFeatureModule,
    PuiPreloaderModule,
    PuiIcon,
    NoDataPlaceholderWidget,
    DataStoresFeatureModule,
    CategoriesFeatureModule,
    TBgWidget,
    WorkspaceFeatureModule,
    ClientsApiFeatureModule,
    SessionFeatureModule
  ]
})
export class BlueprintsModule { }
