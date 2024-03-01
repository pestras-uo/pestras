import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRolesPipe } from './pipes/has-roles.pipe';
import { InOrgunitPipe } from './pipes/in-orgunit.pipe';
import { InGroupsPipe } from './pipes/in-groups.pipe';
import { SessionDirective } from './directives/session.directive';
import { SessionIsPipe } from './pipes/session-is.pipe';
import { IsGuestPipe } from './pipes/is-guest.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    // pipes
    HasRolesPipe,
    InOrgunitPipe,
    InGroupsPipe,
    SessionIsPipe,
    IsGuestPipe,
    // directives
    SessionDirective
  ],
  exports: [
    // pipes
    HasRolesPipe,
    InOrgunitPipe,
    InGroupsPipe,
    SessionIsPipe,
    IsGuestPipe,
    // directives
    SessionDirective
  ]
})
export class SessionFeatureModule { }
