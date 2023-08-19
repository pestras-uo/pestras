import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';

import { ContraModule } from '@pestras/frontend/util/contra';
import { ReactiveFormsModule } from '@angular/forms';
import { PuiCheckInput, PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { UsersListView } from './views/users-list/users-list.view';
import { UserDetailsView } from './views/user-details/user-details.view';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { UserActivityChart } from './charts/user-activity/user-activity.chart';
import { NgxEchartsModule } from 'ngx-echarts';
import { AddUserModal } from './modals/add-user/add-user.modal';
import { DialogModule } from '@angular/cdk/dialog';
import { UpdateRolesModal } from './modals/update-roles/update-roles.modal';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';


@NgModule({
  declarations: [
    UsersPage,
    UsersListView,
    UserDetailsView,
    UserActivityChart,
    AddUserModal,
    UpdateRolesModal
  ],
  imports: [
    // anguler
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    // util
    ContraModule,
    DialogModule,
    // Pui
    PuiIcon,
    PuiSelectInput,
    PuiPreloaderModule,
    PuiUtilPipesModule,
    PuiCheckInput,
    // widgets
    NgxEchartsModule,
    AvatarWidget,
    NoDataPlaceholderWidget
  ]
})
export class UsersModule { }
