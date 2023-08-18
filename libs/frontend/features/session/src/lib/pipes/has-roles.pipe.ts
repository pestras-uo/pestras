import { Pipe, PipeTransform } from '@angular/core';
import { SessionState } from '@pestras/frontend/state';
import { Role } from '@pestras/shared/data-model';

@Pipe({
  name: 'hasRoles'
})
export class HasRolesPipe implements PipeTransform {

  constructor(private session: SessionState) {}

  transform(roles: Role | Role[]): boolean {
    const uRoles = this.session.get()?.roles ?? [];
    
    return Array.isArray(roles)
      ? roles.some(r => uRoles.includes(r))
      : uRoles.includes(roles);
  }

}
