/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, ApiQueryResults, Dashboard, User } from "@pestras/shared/data-model";
import { DashboardsModel } from ".";
import { Filter } from "mongodb";

export async function search(
  this: DashboardsModel,
  query: Partial<ApiQuery<Dashboard>>,
  user: User
) {

  const match: Filter<Dashboard> = user.orgunit === "*"
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

  return (await this.col.aggregate([
    { $match: query.search },
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
    { $sort: query.sort || { serial: 1 } },
    {
      $facet: {
        count: [{ $count: 'value' }],
        results: [
          { $skip: query.skip ?? 0 },
          { $limit: query.limit ?? 10 },
          { $project: Object.assign({ access: 0, _id: 0 }) }
          // { $project: query.select || {} }
        ]
      }
    },
    { $unwind: '$count' },
    {
      $project: {
        count: '$count.value',
        results: '$results'
      }
    }
  ]).toArray())[0] as ApiQueryResults<Dashboard>;
}



export function getByTopic(
  this: DashboardsModel,
  topic: string,
  user: User,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projection?: any
) {
  const match: Filter<Dashboard> = user.orgunit === "*"
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

  return this.col.aggregate<Dashboard>([
    { $match: { topic } },
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



export function getBySerial(
  this: DashboardsModel,
  serial: string,
  projection?: any
) {
  return this.col.findOne({ serial }, { projection });
}


export async function exists(
  this: DashboardsModel,
  serial: string
) {
  return (await this.col.countDocuments({ serial })) > 0;
}


export async function titleExists(
  this: DashboardsModel,
  title: string,
  exclude?: string
) {
  return (await this.col.countDocuments({
    title, serial: { $nin: exclude ? [exclude] : [] }
  })) > 0;
}

export function count(this: DashboardsModel) {
  return this.col.countDocuments({});
}