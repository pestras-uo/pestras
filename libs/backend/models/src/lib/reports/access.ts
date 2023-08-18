import { EntityTypes, User } from "@pestras/shared/data-model";
import { ReportsModel } from ".";

export async function addAccessOrgunit(this: ReportsModel, serial: string, orgunit: string, issuer: User) {

  this.col.updateOne({ serial }, { $addToSet: { 'access.orgunits': orgunit } });

  this.pubSub.emitActivity({
    method: 'addAccessOrgunit',
    create_date: new Date(),
    serial,
    entity: EntityTypes.REPORT,
    issuer: issuer.serial,
    payload: { orgunit },
  })

  return true;
}

export async function removeAccessOrgunit(this: ReportsModel, serial: string, orgunit: string, issuer: User) {

  this.col.updateOne({ serial }, { $pull: { 'access.orgunits': orgunit } });

  this.pubSub.emitActivity({
    method: 'removeAccessOrgunit',
    create_date: new Date(),
    serial,
    entity: EntityTypes.REPORT,
    issuer: issuer.serial,
    payload: { orgunit },
  })

  return true;
}

export async function addAccessUser(this: ReportsModel, serial: string, user: string, issuer: User) {

  this.col.updateOne({ serial }, { $addToSet: { 'access.users': user } });

  this.pubSub.emitActivity({
    method: 'addAccessUser',
    create_date: new Date(),
    serial,
    entity: EntityTypes.REPORT,
    issuer: issuer.serial,
    payload: { user },
  })

  return true;
}

export async function removeAccessUser(this: ReportsModel, serial: string, user: string, issuer: User) {

  this.col.updateOne({ serial }, { $pull: { 'access.users': user } });

  this.pubSub.emitActivity({
    method: 'removeAccessUser',
    create_date: new Date(),
    serial,
    entity: EntityTypes.REPORT,
    issuer: issuer.serial,
    payload: { user },
  })

  return true;
}

export async function addAccessGroup(this: ReportsModel, serial: string, group: string, issuer: User) {

  this.col.updateOne({ serial }, { $addToSet: { 'access.groups': group } });

  this.pubSub.emitActivity({
    method: 'addAccessGroup',
    create_date: new Date(),
    serial,
    entity: EntityTypes.REPORT,
    issuer: issuer.serial,
    payload: { group },
  })

  return true;
}

export async function removeAccessGroup(this: ReportsModel, serial: string, group: string, issuer: User) {

  this.col.updateOne({ serial }, { $pull: { 'access.groups': group } });

  this.pubSub.emitActivity({
    method: 'removeAccessGroup',
    create_date: new Date(),
    serial,
    entity: EntityTypes.REPORT,
    issuer: issuer.serial,
    payload: { group },
  })

  return true;
}