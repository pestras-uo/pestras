import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';

import { ContraModule } from '@pestras/frontend/util/contra';
import { ReactiveFormsModule } from '@angular/forms';
import {
  PuiCheckInput,
  PuiIcon,
  PuiMultiSelectInput,
  PuiPreloaderModule,
  PuiSelectInput,
  PuiUtilPipesModule,
  togglePasswordVisibilityDirective,
} from '@pestras/frontend/ui';
import { UsersListView } from './views/users-list/users-list.view';
import { UserDetailsView } from './views/user-details/user-details.view';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { UserActivityChart } from './charts/user-activity/user-activity.chart';
import { NgxEchartsModule } from 'ngx-echarts';
import { AddUserModal } from './modals/add-user/add-user.modal';
import { DialogModule } from '@angular/cdk/dialog';
import { UpdateRolesModal } from './modals/update-roles/update-roles.modal';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';
import { UpdateUsernameComponent } from './modals/update-username/update-username.component';
import { UpdatePasswordComponent } from './modals/update-password/update-password.component';
import { UpdateProfileComponent } from './modals/update-profile/update-profile.component';

@NgModule({
  declarations: [
    UsersPage,
    UsersListView,
    UserDetailsView,
    UserActivityChart,
    AddUserModal,
    UpdateRolesModal,
    UpdateUsernameComponent,
    UpdatePasswordComponent,
    UpdateProfileComponent,
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
    PuiMultiSelectInput,
    PuiPreloaderModule,
    PuiUtilPipesModule,
    PuiCheckInput,
    // widgets
    NgxEchartsModule,
    AvatarWidget,
    NoDataPlaceholderWidget,
    togglePasswordVisibilityDirective,
  ],
})
export class UsersModule {}
