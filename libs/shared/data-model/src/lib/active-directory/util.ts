import { Role } from "./role";
import { User } from "./user";
import { Serial } from '@pestras/shared/util';

export function isAdminOverUser(admin: User, user: User) {
  if (!admin)
    return false;

  // admin must be admin
  if (!admin.roles.includes(Role.ADMIN))
    return false;

  // admin orgunit must be same or higher of user orgunit
  if (!Serial.isBranch(user.orgunit, admin.orgunit, true))
    return false;

  // when orgunit is same, user should not be admin or admin is root
  if (admin.orgunit === user.orgunit && user.roles.includes(Role.ADMIN) && !admin.is_super)
    return false;

  return true;
}