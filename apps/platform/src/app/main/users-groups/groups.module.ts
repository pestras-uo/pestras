import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsPage } from './groups.page';
import { ReactiveFormsModule } from '@angular/forms';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { DialogModule } from '@angular/cdk/dialog';
import { ListView } from './views/list/list.view';
import { DetailsView } from './views/details/details.view';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { UsersFeatureModule } from '@pestras/frontend/features/users';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';


@NgModule({
  declarations: [
    GroupsPage,
    ListView,
    DetailsView
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    ReactiveFormsModule,
    ContraModule,
    PuiPreloaderModule,
    PuiIcon,
    PuiSelectInput,
    DialogModule,
    NoDataPlaceholderWidget,
    UsersFeatureModule,
    PuiUtilPipesModule,
    AvatarWidget
  ]
})
export class GroupsModule { }
