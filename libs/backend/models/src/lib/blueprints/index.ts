import { Blueprint, User } from "@pestras/shared/data-model";
import { Model } from "../model";
import { getAll, getBySerial, nameExists } from "./read";
import { create, CreateBlueprintInput } from "./create";
import { setOwner, update } from "./update";
import { addCollaborator, removeCollaborator } from "./collaborators";

export { CreateBlueprintInput };

export class BlueprintsModel extends Model<Blueprint> {

  getAll: (issuer: User) => Promise<Blueprint[]> = getAll.bind(this);
  getBySerial: (serial: string, projection?: unknown) => Promise<Blueprint> = getBySerial.bind(this);
  nameExists: (name: string, exclude?: string) => Promise<boolean> = nameExists.bind(this);

  create: (input: CreateBlueprintInput, issuer: string) => Promise<Blueprint> = create.bind(this);
  update: (serial: string, name: string, issuer: User) => Promise<Date> = update.bind(this);

  setOwner: (serial: string, owner: string, issuer: User) => Promise<Date> = setOwner.bind(this);

  addCollaborator: (serial: string, collaborator: string, issuer: User) => Promise<Date> = addCollaborator.bind(this);
  removeCollaborator: (serial: string, collaborator: string, issuer: User) => Promise<Date> = removeCollaborator.bind(this);
}