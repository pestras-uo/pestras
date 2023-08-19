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


@NgModule({
  declarations: [
    MainPage,
    MainHeaderView,
    DrawerView
  ],
  imports: [
    CommonModule,
    RouterModule,
    ContraModule,
    PuiIcon,
    PuiDropdown,
    PuiPreloaderModule,
    SessionFeatureModule,
    TopicsFeatureModule,
    ProfileModule
  ]
})
export class MainModule { }
