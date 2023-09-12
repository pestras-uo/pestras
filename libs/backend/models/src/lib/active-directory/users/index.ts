import { User } from "@pestras/shared/data-model"
import { Model } from "../..//model";
import { count, electAdmin, getAll, getBySerial, getByUsername } from "./read";
import { exists, usernameExists } from "./util";
import { create, CreateUserInput } from "./create";
import { updateOrgunit, updateUsername } from "./update";
import { updateAvatar } from "./avatar";
import { updateProfile } from "./profile";
import { updateRoles, UpdateUserRolesInput } from "./roles";
import { addAlternative, removeAlternative } from "./alternatives";
import { addGroup, removeGroup } from "./groups";

export { CreateUserInput, UpdateUserRolesInput }

export class UsersModel extends Model<User> {

  // getters
  // ---------------------------------------------------------------------------------
  getAll: (projection?: unknown) => Promise<User[]> = getAll.bind(this);
  count: () => Promise<number> = count.bind(this);
  getBySerial: (serial: string, projection?: unknown) => Promise<User> = getBySerial.bind(this);
  getByUsername: (username: string, projection?: unknown) => Promise<User> = getByUsername.bind(this);
  electAdmin: (orgunit: string, projection?: unknown, preferable?: string) => Promise<User> = electAdmin.bind(this);

  // util
  // ---------------------------------------------------------------------------------
  exists: (serial: string) => Promise<boolean> = exists.bind(this);
  usernameExists: (username: string) => Promise<boolean> = usernameExists.bind(this);

  // create
  // ---------------------------------------------------------------------------------
  create: (data: CreateUserInput, hashed: string, issuer: string) => Promise<User> = create.bind(this);

  // update username
  // ---------------------------------------------------------------------------------
  updateUsername: (serial: string, username: string) => Promise<Date> = updateUsername.bind(this);

  // update avatar
  // ---------------------------------------------------------------------------------
  updateAvatar: (serial: string, avatar: string | null) => Promise<Date> = updateAvatar.bind(this);
  updateOrgunit: (serial: string, orgunit: string, issuer: string) => Promise<Date> = updateOrgunit.bind(this);

  // update profile
  // ---------------------------------------------------------------------------------
  updateProfile: (serial: string, fullname: string, mobile: string, email: string) => Promise<Date> = updateProfile.bind(this);

  // update roles
  // ---------------------------------------------------------------------------------
  updateRoles: (serial: string, input: UpdateUserRolesInput, issuer: string) => Promise<Date> = updateRoles.bind(this);

  // alternatives
  // ---------------------------------------------------------------------------------
  addAlternative: (user: string, alternative: string, issuer: string) => Promise<Date> = addAlternative.bind(this);
  removeAlternative: (user: string, alternative: string, issuer: string) => Promise<Date> = removeAlternative.bind(this);

  // groups
  // ---------------------------------------------------------------------------------
  addGroup: (user: string, group: string, issuer: string) => Promise<Date> = addGroup.bind(this);
  removeGroup: (user: string, group: string, issuer: string) => Promise<Date> = removeGroup.bind(this);
}