import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PuiUtilPipesModule } from '../util-pipes/util-pipes.module';
import { PuiIcon } from '../icon/icon.directive';
import { PuiTableTh } from './th/pui-table-th.component';
import { PuiTablePagination } from './pagination/pui-pagination.component';

@NgModule({
  declarations: [
    PuiTableTh,
    PuiTablePagination
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PuiUtilPipesModule,
    PuiIcon,
  ],
  exports: [
    PuiTableTh,
    PuiTablePagination
  ]
})
export class PuiTableModule { }
