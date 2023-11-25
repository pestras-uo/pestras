import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RegionsRoutingModule } from './regions-routing.module';
import { RegionsPage } from './regions.page';
import { RegionsListView } from './views/regions-list/regions-list.view';
import {
  PuiFileInput,
  PuiGisMapModule,
  PuiGoogleMapModule,
  PuiIcon,
  PuiPreloaderModule,
  PuiSelectInput,
  PuiUtilPipesModule,
} from '@pestras/frontend/ui';
import { ContraModule } from '@pestras/frontend/util/contra';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AddRegionModal } from './modals/add-region/add-region.modal';
import { RegionDetailsView } from './views/region-details/region-details.view';
import { UpdateRegionModal } from './modals/update-region/update-region.modal';
import { UpdateCoordsModal } from './modals/update-coords/update-coords.modal';
import { DialogModule } from '@angular/cdk/dialog';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { RegionsFeatureModule } from '@pestras/frontend/features/regions';
import { AddGisMapModalComponent } from './modals/add-gis-map/add-gis-map.modal.component';
import { UpdateGisMapModalComponent } from './modals/update-gis-map/update-gis-map.modal.component';
import { AddGisLayerModalComponent } from './modals/add-gis-layer/add-gis-layer.modal.component';
import { UpdateMapLayerModalComponent } from './modals/update-map-layer/update-map-layer.modal.component';
import { GisViewComponent } from './views/gis-view/gis-view.component';

@NgModule({
  declarations: [
    RegionsPage,
    RegionsListView,
    AddRegionModal,
    RegionDetailsView,
    UpdateRegionModal,
    UpdateCoordsModal,
    AddGisMapModalComponent,
    UpdateGisMapModalComponent,
    AddGisLayerModalComponent,
    UpdateMapLayerModalComponent,
    GisViewComponent
  ],
  imports: [
    // Angular
    CommonModule,
    RegionsRoutingModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiGisMapModule,
    PuiIcon,
    PuiPreloaderModule,
    PuiGoogleMapModule,
    PuiSelectInput,
    PuiFileInput,
    PuiUtilPipesModule,
    // Widgets
    NoDataPlaceholderWidget,
    // Features
    SessionFeatureModule,
    RegionsFeatureModule,
  ],
})
export class RegionsModule { }
