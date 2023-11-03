/* eslint-disable @typescript-eslint/no-explicit-any */
import { Topic, User } from "@pestras/shared/data-model";
import { TopicsModel } from ".";
import { Filter } from "mongodb";

export async function getByBlueprint(this: TopicsModel, bp: string, user: User) {
  const match: Filter<Topic> = user.orgunit === "*"
    ? {}
    : {
      $or: [
        { owner: user.serial },
        {
          $or: [
            {
              $and: [
                { 'access.orgunits': { $size: 0 } },
                { 'access.users': { $size: 0 } },
                { 'access.groups': { $size: 0 } }
              ],
            },
            { 'access.orgunits': user.orgunit },
            { 'access.users': user.serial },
            { 'access.group': { $in: user.groups } }
          ]
        }
      ]
    };

  return this.col.aggregate<Topic>([
    { $match: { blueprin: bp } },
    {
      $lookup: {
        from: 'entities_access',
        localField: 'serial',
        foreignField: 'entity',
        as: "access"
      }
    },
    { $unwind: '$access' },
    { $match: match },
    { $project: Object.assign({ access: 0, _id: 0 }) }
    // { $project: projection || {} }
  ]).toArray();
}

export async function getByParent(this: TopicsModel, parent: string, user: User) {
  const match: Filter<Topic> = user.orgunit === "*"
    ? {}
    : {
      $or: [
        { owner: user.serial },
        {
          $or: [
            {
              $and: [
                { 'access.orgunits': { $size: 0 } },
                { 'access.users': { $size: 0 } },
                { 'access.groups': { $size: 0 } }
              ],
            },
            { 'access.orgunits': user.orgunit },
            { 'access.users': user.serial },
            { 'access.group': { $in: user.groups } }
          ]
        }
      ]
    };

  return this.col.aggregate<Topic>([
    { $match: { parent: parent ?? null } },
    {
      $lookup: {
        from: 'entities_access',
        localField: 'serial',
        foreignField: 'entity',
        as: "access"
      }
    },
    { $unwind: '$access' },
    { $match: match },
    { $project: Object.assign({ access: 0, _id: 0 }) }
    // { $project: projection || {} }
  ]).toArray();
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