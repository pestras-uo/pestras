import { Topic } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { getByBlueprint, getBySerial, getByParent, nameExists } from "./read";
import { create } from "./create";
import { update } from "./update";
import { addAccessGroup, addAccessOrgunit, addAccessUser, removeAccessGroup, removeAccessOrgunit, removeAccessUser } from "./access";

export { CreateTopicInput } from './create';
export { UpdateTopicInput } from './update';

export class TopicsModel extends Model<Topic> {

  getByBlueprint = getByBlueprint.bind(this);
  getByParent = getByParent.bind(this);
  getBySerial = getBySerial.bind(this);
  nameExists = nameExists.bind(this);

  create = create.bind(this);
  update = update.bind(this);

  // access
  // -------------------------------------------------------------------------------------
  addAccessOrgunit = addAccessOrgunit.bind(this);
  removeAccessOrgunit = removeAccessOrgunit.bind(this);
  addAccessUser = addAccessUser.bind(this);
  removeAccessUser = removeAccessUser.bind(this);
  addAccessGroup = addAccessGroup.bind(this);
  removeAccessGroup = removeAccessGroup.bind(this);
}