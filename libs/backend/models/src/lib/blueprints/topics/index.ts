/* eslint-disable @typescript-eslint/no-explicit-any */
import { Topic, User } from "@pestras/shared/data-model";
import { Model } from "../../model";
import { getByBlueprint, getBySerial, getByParent, nameExists } from "./read";
import { create, CreateTopicInput } from "./create";
import { update, UpdateTopicInput } from "./update";

export { CreateTopicInput, UpdateTopicInput };

export class TopicsModel extends Model<Topic> {

  getByBlueprint: (bp: string, user: User) => Promise<Topic[]> = getByBlueprint.bind(this);
  getByParent: (parent: string, user: User) => Promise<Topic[]> = getByParent.bind(this);
  getBySerial: (serial: string, projection?: any) => Promise<Topic | null> = getBySerial.bind(this);
  nameExists: (bp: string, name: string, exclude?: string) => Promise<boolean> = nameExists.bind(this);

  create: (input: CreateTopicInput, issuer: User) => Promise<Topic> = create.bind(this);
  update: (serial: string, input: UpdateTopicInput, issuer: User) => Promise<Date> = update.bind(this);
}