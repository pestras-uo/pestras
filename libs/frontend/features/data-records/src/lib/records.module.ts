import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordPipe } from './pipes/record.pipe';
import { RecordsPipe } from './pipes/records.pipe';
import { RecordCardView } from './views/record-card/record-card.view';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { RouterModule } from '@angular/router';
import { PuiIcon, PuiInfiniteScroll, PuiSideDrawerModule, PuiTableModule, PuiUtilPipesModule, PuiCheckInput, PuiMultiSelectInput } from '@pestras/frontend/ui';
import { CategoriesFeatureModule } from '@pestras/frontend/features/categories';
import { ContraModule } from '@pestras/frontend/util/contra';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { BlueprintsFeatureModule } from '@pestras/frontend/features/blueprints';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { QueryRecordsPipe } from './pipes/query-records.pipe';
import { DataStoresFeatureModule } from '@pestras/frontend/features/data-stores';
import { TreeViewWidget } from '@pestras/frontend/widgets/tree-view';
import { AdvancedSearchModal } from './modals/advanced-search/advanced-search.modal';
import { ReactiveFormsModule } from '@angular/forms';
import { RecordsCardView } from './views/records-list/records-cards/records-cards.view';
import { RecordsTableView } from './views/records-list/records-table/records-table.view';
import { TreeViewView } from './views/records-list/records-tree/records-tree.view';
import { RecordsListView } from './views/records-list/records-list.view';



@NgModule({
  declarations: [
    RecordPipe,
    RecordsPipe,
    QueryRecordsPipe,
    RecordCardView,
    AdvancedSearchModal,
    RecordsCardView,
    RecordsTableView,
    TreeViewView,
    RecordsListView
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // Util
    AvatarWidget,
    NoDataPlaceholderWidget,
    // Features
    DataStoresFeatureModule,
    CategoriesFeatureModule,
    BlueprintsFeatureModule,
    SessionFeatureModule,
    // Contra
    ContraModule,
    // PUI
    PuiTableModule,
    PuiInfiniteScroll,
    PuiIcon,
    PuiSideDrawerModule,
    PuiUtilPipesModule,
    PuiCheckInput,
    PuiMultiSelectInput,
    // Widgets
    TreeViewWidget  
  ],
  exports: [
    RecordPipe,
    RecordsPipe,
    QueryRecordsPipe,
    RecordCardView,
    RecordsListView
  ]
})
export class RecordsFeatureModule { }
