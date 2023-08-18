import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPipe } from './pipes/user.pipe';
import { UsersPipe } from './pipes/users.pipe';
import { UserUsersPipe } from './pipes/user-users.pipe';



@NgModule({
  declarations: [
    UserPipe,
    UsersPipe,
    UserUsersPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UserPipe,
    UsersPipe,
    UserUsersPipe
  ]
})
export class UsersFeatureModule { }
