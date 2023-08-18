import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersGroupsPipe } from './pipes/users-groups.pipe';



@NgModule({
  declarations: [
    UsersGroupsPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UsersGroupsPipe
  ]
})
export class UsersGroupsFeatureModule { }
