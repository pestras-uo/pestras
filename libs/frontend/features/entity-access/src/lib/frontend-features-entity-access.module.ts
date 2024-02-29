import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityAccessViewComponent } from './entity-access/entity-access.view';
import { ReactiveFormsModule } from '@angular/forms';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiCheckInput, PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiToastModule, PuiUtilPipesModule } from '@pestras/frontend/ui';import { DialogModule } from '@angular/cdk/dialog';
import { OrgunitsFeatureModule } from '@pestras/frontend/features/orgunits';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { UsersGroupsFeatureModule } from '@pestras/frontend/features/users-groups';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
;

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiPreloaderModule,
    PuiIcon,
    PuiToastModule,
    PuiUtilPipesModule,
    PuiSelectInput,
    PuiCheckInput,
    // Features
    OrgunitsFeatureModule,
    UsersFeatureModule,
    UsersGroupsFeatureModule,
    // Widgets
    NoDataPlaceholderWidget
  ],
  declarations: [EntityAccessViewComponent],
  exports: [EntityAccessViewComponent],
})
export class EntityAccessFeatureModule {}
