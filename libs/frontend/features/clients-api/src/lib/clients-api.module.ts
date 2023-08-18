import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsApiListView } from './views/clients-api-list/clients-api-list.view';
import { RouterModule } from '@angular/router';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiIcon, PuiPreloaderModule } from '@pestras/frontend/ui';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { DialogModule } from '@angular/cdk/dialog';
import { StateModule } from '@pestras/frontend/state';



@NgModule({
  declarations: [
    ClientsApiListView
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    // state
    StateModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiIcon,
    PuiPreloaderModule,
    // Widgets
    NoDataPlaceholderWidget
  ],
  exports: [
    ClientsApiListView
  ]
})
export class ClientsApiFeatureModule { }
