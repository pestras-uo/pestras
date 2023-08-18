import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiFileInput, PuiIcon, PuiImageInput, PuiImagesViewerModule, PuiPreloaderModule, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AttachmentsListView } from './views/attachments-list/attachments-list.view';
import { StateModule } from '@pestras/frontend/state';



@NgModule({
  declarations: [
    AttachmentsListView
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // state
    StateModule,
    // Util
    DialogModule,
    ContraModule,
    // Pui
    PuiPreloaderModule,
    PuiIcon,
    PuiImageInput,
    PuiFileInput,
    PuiUtilPipesModule,
    PuiImagesViewerModule,
    // Widgets
    NoDataPlaceholderWidget
  ],
  exports: [
    AttachmentsListView
  ]
})
export class AttachmentsFeatureModule { }
