import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgunitPipe } from './pipes/orgunit.pipe';
import { OrgunitsPipe } from './pipes/orgunits.pipe';
import { UserOrgunitsPipe } from './pipes/user-orgunits.pipe';
import { OrgunitCountPipe } from './pipes/count.pipe';



@NgModule({
  declarations: [
    OrgunitPipe,
    OrgunitsPipe,
    UserOrgunitsPipe,
    OrgunitCountPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OrgunitPipe,
    OrgunitsPipe,
    UserOrgunitsPipe,
    OrgunitCountPipe
  ]
})
export class OrgunitsFeatureModule { }
