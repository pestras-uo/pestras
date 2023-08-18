/* eslint-disable @typescript-eslint/no-explicit-any */
import { Blueprint, User } from "@pestras/shared/data-model";
import { BlueprintsModel } from ".";
import { Filter } from "mongodb";

export async function getAll(this: BlueprintsModel, issuer: User) {
  const query: Filter<Blueprint> = issuer.orgunit === "*"
    ? {}
    : { orgunit: { $regex: new RegExp(`${issuer.orgunit}$`) } };
    
  return this.col.find(query).toArray();
}

export async function getBySerial(this: BlueprintsModel, serial: string, projection?: any) {
  return this.col.findOne({ serial }, { projection });
}

export async function nameExists(this: BlueprintsModel, name: string, exclude?: string) {
  return (await this.col.countDocuments({
    name,
    serial: { $nin: exclude ? [exclude] : [] }
  })) > 0;
}