import { Blueprint } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getAll, getBySerial, nameExists } from "./read";
import { create } from "./create";
import { setOwner, update } from "./update";
import { addCollaborator, removeCollaborator } from "./collaborators";

export class BlueprintsModel extends Model<Blueprint> {

  getAll = getAll.bind(this);
  getBySerial = getBySerial.bind(this);
  nameExists = nameExists.bind(this);

  create = create.bind(this);
  update = update.bind(this);

  setOwner = setOwner.bind(this);

  addCollaborator = addCollaborator.bind(this);
  removeCollaborator = removeCollaborator.bind(this);
}