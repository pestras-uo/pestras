import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPipe } from './pipes/user.pipe';
import { UsersPipe } from './pipes/users.pipe';
import { UserUsersPipe } from './pipes/user-users.pipe';
import { UsersCountPipe } from './pipes/count.pipe';



@NgModule({
  declarations: [
    UserPipe,
    UsersPipe,
    UserUsersPipe,
    UsersCountPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UserPipe,
    UsersPipe,
    UserUsersPipe,
    UsersCountPipe
  ]
})
export class UsersFeatureModule { }
