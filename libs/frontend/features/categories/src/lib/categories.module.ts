import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryPipe } from './pipes/category.pipe';
import { CategoryBranchesPipe } from './pipes/category-branches.pipe';
import { BpCategoriesPipe } from './pipes/bp-categories.pipe';
import { AddCategoryModal } from './modals/add-category/add-category.modal';
import { UpdateCategoryModal } from './modals/update-category/update-category.modal';
import { ReactiveFormsModule } from '@angular/forms';
import { PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiTableModule, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { ContraModule } from '@pestras/frontend/util/contra';
import { CategoriesListView } from './views/categories-list/categories-list.view';
import { CategoryDetailsView } from './views/category-details/category-details.view';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { CategoriesView } from './views/categories/categories.view';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { StateModule } from '@pestras/frontend/state';



@NgModule({
  declarations: [
    CategoryPipe,
    CategoryBranchesPipe,
    BpCategoriesPipe,
    AddCategoryModal,
    UpdateCategoryModal,
    CategoriesListView,
    CategoryDetailsView,
    CategoriesView
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // state
    StateModule,
    // Pui
    PuiSelectInput,
    PuiPreloaderModule,
    PuiIcon,
    PuiTableModule,
    PuiUtilPipesModule,
    // Util
    ContraModule,
    // Widgets
    NoDataPlaceholderWidget,
    // Features
    SessionFeatureModule
  ],
  exports: [
    CategoryPipe,
    CategoryBranchesPipe,
    BpCategoriesPipe,
    CategoriesView
  ]
})
export class CategoriesFeatureModule { }
