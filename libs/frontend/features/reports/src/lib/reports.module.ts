import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsListView } from './views/reports-list/reports-list.view';
import { RouterModule } from '@angular/router';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { ExportToPdfDirective, PuiIcon, PuiImageInput, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { ReportSlideView } from './views/report-slide/report-slide.view';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataVizFeatureModule } from '@pestras/frontend/features/data-viz';
import { QuillModule } from 'ngx-quill';
import { ReportPipe } from './pipes/report.pipe';
import { ContraModule } from '@pestras/frontend/util/contra';



@NgModule({
  declarations: [
    ReportsListView,
    ReportSlideView,
    ReportPipe,
    
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // Util                    
    ContraModule,
    DialogModule,
    DragDropModule,
    PuiUtilPipesModule,
    // Widgets
    NoDataPlaceholderWidget,
    QuillModule,
    // Pui
    PuiIcon,
    PuiPreloaderModule,
    PuiSelectInput,
    PuiImageInput,
    // Features
    DataVizFeatureModule,
    
      //export pdf 
   ExportToPdfDirective,
  ],
  exports: [
    ReportsListView,
    ReportSlideView,
    ReportPipe
  ]
})
export class ReportsFeaturesModule { }
