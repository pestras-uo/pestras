import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRolesPipe } from './pipes/has-roles.pipe';
import { InOrgunitPipe } from './pipes/in-orgunit.pipe';
import { InGroupsPipe } from './pipes/in-groups.pipe';
import { SessionDirective } from './directives/session.directive';
import { SessionIsPipe } from './pipes/session-is.pipe';



@NgModule({
  declarations: [
    HasRolesPipe,
    InOrgunitPipe,
    InGroupsPipe,
    SessionIsPipe,
    SessionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HasRolesPipe,
    InOrgunitPipe,
    InGroupsPipe,
    SessionIsPipe,
    SessionDirective
  ]
})
export class SessionFeatureModule { }
