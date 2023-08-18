/* eslint-disable @typescript-eslint/no-explicit-any */
import { Topic, User } from "@pestras/shared/data-model";
import { TopicsModel } from ".";
import { Filter } from "mongodb";

export async function getByBlueprint(this: TopicsModel, bp: string, user: User) {
  const query: Filter<Topic> = user.orgunit === "*"
    ? { blueprin: bp }
    : {
      blueprin: bp,
      $and: [
        { $or: [{ 'access.orgunits': { $size: 0 } }, { 'access.orgunits': user.orgunit }] },
        { $or: [{ 'access.users': { $size: 0 } }, { 'access.users': user.serial }] },
        { $or: [{ 'access.groups': { $size: 0 } }, { 'access.group': { $in: user.groups } }] }
      ]
    };

  return this.col.find(query).toArray();
}

export async function getByParent(this: TopicsModel, parent: string, user: User) {
  const query: Filter<Topic> = user.orgunit === "*"
    ? { parent: parent ?? null }
    : {
      parent: parent ?? null,
      $and: [
        { $or: [{ 'access.orgunits': { $size: 0 } }, { 'access.orgunits': user.orgunit }] },
        { $or: [{ 'access.users': { $size: 0 } }, { 'access.users': user.serial }] },
        { $or: [{ 'access.groups': { $size: 0 } }, { 'access.group': { $in: user.groups } }] }
      ]
    };

  return this.col.find(query).toArray();
}

export async function getBySerial(this: TopicsModel, serial: string, projection?: any) {
  return this.col.findOne({ serial }, { projection });
}

export async function nameExists(this: TopicsModel, bp: string, name: string, exclude?: string) {
  return (await this.col.countDocuments({
    name,
    blueprint: bp,
    serial: { $nin: exclude ? [exclude] : [] }
  })) > 0;
}