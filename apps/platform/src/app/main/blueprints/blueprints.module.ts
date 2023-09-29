import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlueprintsRoutingModule } from './blueprints-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MainPage } from './main/main.page';
import { BlueprintsRouter } from './blueprints.router';
import { SideMenuView } from './views/side-menu/side-menu.view';
import { DetailsPage } from './details/details.page';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { CategoriesFeatureModule } from '@pestras/frontend/features/categories';
import { WorkspaceFeatureModule } from '@pestras/frontend/features/workspace';
import { ClientsApiFeatureModule } from '@pestras/frontend/features/clients-api';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { ContentViewsFeatureModule } from '@pestras/frontend/features/content-views';
import { WorkflowsFeatureModule } from '@pestras/frontend/features/workflows';
import { BlueprintsListViewComponent } from './views/blueprints-list/blueprints-list.view';
import { BlueprintsFeatureModule } from '@pestras/frontend/features/blueprints';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { CollaboratorsViewComponent } from './views/collaborators/collaborators.view';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';


@NgModule({
  declarations: [
    MainPage,
    BlueprintsRouter,
    BlueprintsListViewComponent,
    SideMenuView,
    DetailsPage,
    CollaboratorsViewComponent
  ],
  imports: [
    // Angular
    CommonModule,
    BlueprintsRoutingModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    // Pui
    PuiIcon,
    PuiPreloaderModule,
    PuiSelectInput,
    PuiUtilPipesModule,
    // Widgets
    NoDataPlaceholderWidget,
    // Features
    BlueprintsFeatureModule,
    WorkflowsFeatureModule,
    ContentViewsFeatureModule,
    DataStoresFeatureModule,
    CategoriesFeatureModule,
    WorkspaceFeatureModule,
    ClientsApiFeatureModule,
    SessionFeatureModule,
    UsersFeatureModule,
    OrgunitsFeatureModule
  ]
})
export class BlueprintsModule { }
