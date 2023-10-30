import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './views/notifications-list/notifications-list.component';
import { ContraModule } from '@pestras/frontend/util/contra';
import { PuiIcon, PuiSideDrawerModule } from '@pestras/frontend/ui';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { NoDataPlaceholderWidget } from '@pestras/frontend/widgets/no-data-placeholder';


@NgModule({
  imports: [
    CommonModule,
    // util
    ContraModule,
    // Pui
    PuiSideDrawerModule,
    PuiIcon,
    // widgets
    AvatarWidget,
    NoDataPlaceholderWidget
  ],
  declarations: [NotificationsListComponent],
  exports: [NotificationsListComponent],
})
export class NotificationsFeatureModule {}
