import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePage } from './profile.page';
import { ReactiveFormsModule } from '@angular/forms';
import { PuiIcon, PuiImageInput, PuiPreloaderModule } from '@pestras/frontend/ui';
import { AvatarWidget } from '@pestras/frontend/widgets/avatar';
import { DialogModule } from '@angular/cdk/dialog';
import { ContraModule } from '@pestras/frontend/util/contra';



@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContraModule,
    PuiPreloaderModule,
    PuiIcon,
    PuiImageInput,
    AvatarWidget,
    DialogModule
  ],
  exports: [
    ProfilePage
  ]
})
export class ProfileModule { }
