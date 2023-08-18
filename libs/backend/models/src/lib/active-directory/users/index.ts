import { User } from "@pestras/shared/data-model"
import { Model } from "../..//model";
import { count, electAdmin, getAll, getBySerial, getByUsername } from "./read";
import { exists, usernameExists } from "./util";
import { create } from "./create";
import { updateOrgunit, updateUsername } from "./update";
import { updateAvatar } from "./avatar";
import { updateProfile } from "./profile";
import { updateRoles } from "./roles";
import { addAlternative, removeAlternative } from "./alternatives";
import { addGroup, removeGroup } from "./groups";

export { CreateUserInput } from './create';
export { UpdateUserRolesInput } from './roles';

export class UsersModel extends Model<User> {

  // getters
  // ---------------------------------------------------------------------------------
  getAll = getAll.bind(this);
  count = count.bind(this);
  getBySerial = getBySerial.bind(this);
  getByUsername = getByUsername.bind(this);
  electAdmin = electAdmin.bind(this);

  // util
  // ---------------------------------------------------------------------------------
  exists = exists.bind(this);
  usernameExists = usernameExists.bind(this);

  // create
  // ---------------------------------------------------------------------------------
  create = create.bind(this);

  // update username
  // ---------------------------------------------------------------------------------
  updateUsername = updateUsername.bind(this);

  // update avatar
  // ---------------------------------------------------------------------------------
  updateAvatar = updateAvatar.bind(this);
  updateOrgunit = updateOrgunit.bind(this);

  // update profile
  // ---------------------------------------------------------------------------------
  updateProfile = updateProfile.bind(this);

  // update roles
  // ---------------------------------------------------------------------------------
  updateRoles = updateRoles.bind(this);

  // alternatives
  // ---------------------------------------------------------------------------------
  addAlternative = addAlternative.bind(this);
  removeAlternative = removeAlternative.bind(this);

  // groups
  // ---------------------------------------------------------------------------------
  addGroup = addGroup.bind(this);
  removeGroup = removeGroup.bind(this);
}