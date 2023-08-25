import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DataStoreInput } from './forms/data-store-input/data-store.input';
import { ReactiveFormsModule } from '@angular/forms';
import { DataStorePipe } from './pipes/data-store.pipe';
import { PuiCheckInput, PuiGoogleMapModule, PuiIcon, PuiImageInput, PuiMultiSelectInput, PuiPreloaderModule, PuiSelectInput, PuiSwitchInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { ContraModule } from '@pestras/frontend/util/contra';
import { DataStoresListView } from './views/data-stores-list/data-stores-list.view';
import { DialogModule } from '@angular/cdk/dialog';
import { RouterModule } from '@angular/router';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { BlueprintDataStoresPipe } from './pipes/blueprint-datastores.pipe';
import { DataStoreFieldsPipe } from './pipes/data-store-fields.pipe';
import { FieldForm } from './forms/field/field.form';
import { FieldDetailsView } from './views/field-details/field-details.view';
import { fieldValuePipe } from './pipes/field-value.pipe';
import { FieldInputForm } from './forms/field-input/field-input.form';
import { FieldValueView } from './views/field-value/field-value.view';
import { SelectRecordPipe } from './pipes/select-record.pipe';
import { QuillModule } from 'ngx-quill';
import { CategoriesFeatureModule } from '@pestras/frontend/features/categories';
import { RegionsFeatureModule } from '@pestras/frontend/features/regions';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { TopicsFeatureModule } from '@pestras/frontend/features/topics';
import { FieldConstraintModal } from './modals/field-constraint/field-constraint.modal';
import { FieldConstraintsView } from './views/field-constraints/field-constraints.view';
import { GoogleMapLinkPipe } from './pipes/googleMapLink.pipe';



@NgModule({
  declarations: [
    // forms
    DataStoreInput,
    FieldForm,
    FieldInputForm,
    // views
    DataStoresListView,
    FieldDetailsView,
    FieldValueView,
    FieldConstraintsView,
    // modals
    FieldConstraintModal,
    //pipes
    DataStorePipe,
    BlueprintDataStoresPipe,
    DataStoreFieldsPipe,
    fieldValuePipe,
    SelectRecordPipe,
    GoogleMapLinkPipe
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiSelectInput,
    PuiMultiSelectInput,
    PuiPreloaderModule,
    PuiUtilPipesModule,
    PuiIcon,
    PuiSwitchInput,
    PuiGoogleMapModule,
    PuiCheckInput, 
    PuiImageInput,
    // Widgets
    QuillModule,
    NoDataPlaceholderWidget, 
    NoDataPlaceholderWidget,
    // features
    CategoriesFeatureModule,
    RegionsFeatureModule, 
    OrgunitsFeatureModule, 
    UsersFeatureModule,
    TopicsFeatureModule
  ],
  providers: [DatePipe],
  exports: [
    DataStoreInput,
    DataStoresListView,
    DataStorePipe,
    BlueprintDataStoresPipe,
    DataStoreFieldsPipe,
    FieldForm,
    FieldDetailsView,
    fieldValuePipe,
    FieldInputForm,
    FieldValueView,
    SelectRecordPipe
  ]
})
export class DataStoresFeatureModule { }
