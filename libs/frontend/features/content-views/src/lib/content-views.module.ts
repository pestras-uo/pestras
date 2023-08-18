import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentViewsComponent } from './views/content-views.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PuiIcon, PuiImageInput, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { ContraModule } from '@pestras/frontend/util/contra';
import { QuillModule } from 'ngx-quill';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { StateModule } from '@pestras/frontend/state';



@NgModule({
  declarations: [
    ContentViewsComponent
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // state
    StateModule,
    // Util
    DialogModule,
    DragDropModule,
    PuiUtilPipesModule,
    ContraModule,
    // Pui
    PuiImageInput,
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    // Widgets
    QuillModule,
    NoDataPlaceholderWidget
  ],
  exports: [
    ContentViewsComponent
  ]
})
export class ContentViewsFeatureModule { }
