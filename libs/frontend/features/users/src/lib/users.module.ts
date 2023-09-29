import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPipe } from './pipes/user.pipe';
import { UsersPipe } from './pipes/users.pipe';
import { UserUsersPipe } from './pipes/user-users.pipe';
import { UsersCountPipe } from './pipes/count.pipe';
import { UsersBySerialsPipe } from './pipes/users-by-serials.pipe';



@NgModule({
  declarations: [
    UserPipe,
    UsersPipe,
    UserUsersPipe,
    UsersCountPipe,
    UsersBySerialsPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UserPipe,
    UsersPipe,
    UserUsersPipe,
    UsersCountPipe,
    UsersBySerialsPipe
  ]
})
export class UsersFeatureModule { }
