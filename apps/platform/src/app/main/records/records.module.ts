import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicsRoutingModule } from './records-routing.module';
import { RecordsRouter } from './records.router';
import { ReactiveFormsModule } from '@angular/forms';
import { AddFormPage } from './add-form/add-form.page';
import { QuillModule } from 'ngx-quill';
import { DetailsPage } from './details/details.page';
import { HistoryView } from './views/history/history.view';
import { DialogModule } from '@angular/cdk/dialog';
import { SideMenuView } from './views/side-menu/side-menu.view';
import { DescView } from './views/desc/desc.view';
import { UpdateFormPage } from './update-form/update-form.page';
import { SubDataStoresRecordsView } from './views/sub-data-stores-records/sub-data-stores-records.view';
import { TBgWidget } from '@pestras/frontend/widgets/t-bg';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { ContraModule } from '@pestras/frontend/util/contra';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { CategoriesFeatureModule } from '@pestras/frontend/features/categories';
import { RegionsFeatureModule } from '@pestras/frontend/features/regions';
import { RecordsFeatureModule } from '@pestras/frontend/features/data-records';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { BlueprintsFeatureModule } from '@pestras/frontend/features/blueprints';
import { AttachmentsFeatureModule } from '@pestras/frontend/features/attachments';
import { PuiIcon, PuiImageInput, PuiInfiniteScroll, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';


@NgModule({
  declarations: [
    RecordsRouter,
    AddFormPage,
    DetailsPage,
    SideMenuView,
    DescView,
    HistoryView,
    UpdateFormPage,
    SubDataStoresRecordsView
  ],
  imports: [
    CommonModule,
    TopicsRoutingModule,
    ReactiveFormsModule,
    // widgets
    TBgWidget,
    NoDataPlaceholderWidget,
    QuillModule,
    AvatarWidget,
    // util
    ContraModule,
    DialogModule,
    // features
    DataStoresFeatureModule,
    CategoriesFeatureModule,
    RegionsFeatureModule,
    AttachmentsFeatureModule,
    RecordsFeatureModule,
    SessionFeatureModule,
    BlueprintsFeatureModule,
    // PUI
    PuiInfiniteScroll,
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    PuiImageInput,
    PuiUtilPipesModule
  ]
})
export class RecordsModule { }
