import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PuiTableDynamic } from "./table-dynamic/table-dynamic.component";
import { GetBoolFieldValuePipe } from './pipes/bool-field-value.pipe';
import { RowTitlePipe } from './pipes/row-title-.pipe';
import { ListFieldValuePipe } from './pipes/list-field-value.pipe';
import { DateFieldValuePipe } from './pipes/date-field-value.pipe';
import { NumberFieldValuePipe } from './pipes/number-field-value.pipe';
import { StringFieldValuePipe } from './pipes/string-field-value.pipe';
import { PuiUtilPipesModule } from "../util-pipes/util-pipes.module";
import { SkipValuePipe } from './pipes/skip-value.pipe';
import { PuiIcon } from "../icon/icon.directive";
import { PuiTable } from "./table/table.component";
import { GoogleMapLinkPipe } from "./pipes/googleMapLink.pipe";
import { PuiIndicator } from "../indicator/indicator.component";

@NgModule({
  declarations: [
    PuiTable,
    PuiTableDynamic, 
    GetBoolFieldValuePipe,
    RowTitlePipe,
    ListFieldValuePipe,
    DateFieldValuePipe,
    NumberFieldValuePipe,
    StringFieldValuePipe,
    SkipValuePipe,
    GoogleMapLinkPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PuiUtilPipesModule,
    PuiIcon,
    PuiIndicator
  ],
  exports: [
    PuiTable,
    PuiTableDynamic
  ]
})
export class PuiTableModule { };