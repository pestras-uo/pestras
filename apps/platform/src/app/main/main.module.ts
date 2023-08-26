import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPage } from './main.page';
import { RouterModule } from '@angular/router';
import { MainHeaderView } from './views/main-header/main-header.view';
import { DrawerView } from './views/drawer/drawer.view';
import { PuiDropdown, PuiIcon, PuiPreloaderModule } from '@pestras/frontend/ui';
import { SessionFeatureModule } from '@pestras/frontend/features/session';
import { ContraModule } from '@pestras/frontend/util/contra';
import { TopicsFeatureModule } from '@pestras/frontend/features/topics';
import { ProfileModule } from './profile/profile.module';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';


@NgModule({
  declarations: [
    MainPage,
    MainHeaderView,
    DrawerView
  ],
  imports: [
    // Angule
    CommonModule,
    RouterModule,
    // Util
    ContraModule,
    // Pui
    PuiIcon,
    PuiDropdown,
    PuiPreloaderModule,
    // widgets
    AvatarWidget,
    // Features
    SessionFeatureModule,
    TopicsFeatureModule,
    // pages
    ProfileModule
  ]
})
export class MainModule { }
