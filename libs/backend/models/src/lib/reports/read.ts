/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, ApiQueryResults, Report, User } from "@pestras/shared/data-model";
import { Filter } from "mongodb";
import { ReportsModel } from ".";

export async function search(
  this: ReportsModel,
  query: Partial<ApiQuery<Report>>,
  user: User
) {

  const match: Filter<Report> = user.is_guest
    ? { 'access.allow_guests': true }
    : user.orgunit === "*"
      ? {}
      : {
        $or: [
          { owner: user.serial },
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
  ]).toArray())[0] as ApiQueryResults<Report>;
}



export function getByTopic(
  this: ReportsModel,
  topic: string,
  user: User,
  projection?: any
) {
  const match: Filter<Report> = user.orgunit === "*"
    ? {}
    : {
      $or: [
        { owner: user.serial },
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
    };

  return this.col.aggregate<Report>([
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
  this: ReportsModel,
  serial: string,
  projection?: any
) {
  return this.col.findOne({ serial }, { projection });
}


export async function exists(
  this: ReportsModel,
  serial: string
) {
  return (await this.col.countDocuments({ serial })) > 0;
}


export async function titleExists(
  this: ReportsModel,
  title: string,
  exclude?: string
) {
  return (await this.col.countDocuments({
    title, serial: { $nin: exclude ? [exclude] : [] }
  })) > 0;
}