import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RegionsRoutingModule } from './regions-routing.module';
import { RegionsPage } from './regions.page';
import { RegionsListView } from './views/regions-list/regions-list.view';
import { PuiFileInput, PuiGoogleMapModule, PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { ContraModule } from '@pestras/frontend/util/contra';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AddRegionModal } from './modals/add-region/add-region.modal';
import { RegionDetailsView } from './views/region-details/region-details.view';
import { UpdateRegionModal } from './modals/update-region/update-region.modal';
import { UpdateCoordsModal } from './modals/update-coords/update-coords.modal';
import { DialogModule } from '@angular/cdk/dialog';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { RegionsFeatureModule } from '@pestras/frontend/features/regions';


@NgModule({
  declarations: [
    RegionsPage,
    RegionsListView,
    AddRegionModal,
    RegionDetailsView,
    UpdateRegionModal,
    UpdateCoordsModal
  ],
  imports: [
    CommonModule,
    RegionsRoutingModule,
    ReactiveFormsModule,
    ContraModule,
    DialogModule,
    PuiIcon,
    PuiPreloaderModule,
    PuiGoogleMapModule,
    NoDataPlaceholderWidget,
    PuiSelectInput,
    PuiFileInput,
    SessionFeatureModule,
    RegionsFeatureModule,
    PuiUtilPipesModule
  ]
})
export class RegionsModule { }
