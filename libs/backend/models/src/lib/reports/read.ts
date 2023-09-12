/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiQuery, ApiQueryResults, Report, User } from "@pestras/shared/data-model";
import { Filter } from "mongodb";
import { ReportsModel } from ".";

export async function search(
  this: ReportsModel,
  query: Partial<ApiQuery<Report>>
) {
  const count = await this.col.countDocuments(query.search as Filter<Report>);
  const results = await this.col.find(query.search as any, {
    sort: query.sort ?? { _id: 1 },
    skip: query.skip ?? 0,
    limit: query.limit ?? 10,
    projection: query.select || {}
  })
    .toArray();

  return { count, results } as ApiQueryResults<Report>;
}



export function getByTopic(
  this: ReportsModel,
  topic: string,
  user: User,
  projection?: any
) {
  const query: Filter<Report> = user.orgunit === "*"
    ? { topic }
    : {
      topic,
      $and: [
        { $or: [{ 'access.orgunits': { $size: 0 } }, { 'access.orgunits': user.orgunit }] },
        { $or: [{ 'access.users': { $size: 0 } }, { 'access.users': user.serial }] },
        { $or: [{ 'access.groups': { $size: 0 } }, { 'access.group': { $in: user.groups } }] }
      ]
    };

  return this.col.find(query, { projection }).toArray();
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