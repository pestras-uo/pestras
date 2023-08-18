import { Auth } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { create } from "./create";
import { getAll, getByUserSerial } from "./read";
import { updatePassword } from "./update-password";
import { exists } from "./util";

export class AuthModel extends Model<Auth> {

  // getters
  // ---------------------------------------------------------------------------------------
  getAll = getAll.bind(this);
  getByUserSerial = getByUserSerial.bind(this);


  // util
  // ---------------------------------------------------------------------------------------
  exists = exists.bind(this);


  // create
  // ---------------------------------------------------------------------------------------
  create = create.bind(this);


  // update password
  // ---------------------------------------------------------------------------------------
  updatePassword = updatePassword.bind(this);
}