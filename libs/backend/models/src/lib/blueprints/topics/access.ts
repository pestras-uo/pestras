import { EntityTypes, Role, User } from "@pestras/shared/data-model";
import { TopicsModel } from ".";

export async function addAccessOrgunit(this: TopicsModel, serial: string, orgunit: string, issuer: User) {

  this.col.updateOne({ serial }, { $addToSet: { 'access.orgunits': orgunit } });

  this.pubSub.emitActivity({
    method: 'addAccessOrgunit',
    create_date: new Date(),
    serial,
    entity: EntityTypes.TOPIC,
    issuer: issuer.serial,
    payload: { orgunit }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN]
  });

  return true;
}

export async function removeAccessOrgunit(this: TopicsModel, serial: string, orgunit: string, issuer: User) {

  this.col.updateOne({ serial }, { $pull: { 'access.orgunits': orgunit } });

  this.pubSub.emitActivity({
    method: 'removeAccessOrgunit',
    create_date: new Date(),
    serial,
    entity: EntityTypes.TOPIC,
    issuer: issuer.serial,
    payload: { orgunit }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN]
  })

  return true;
}

export async function addAccessUser(this: TopicsModel, serial: string, user: string, issuer: User) {

  this.col.updateOne({ serial }, { $addToSet: { 'access.users': user } });

  this.pubSub.emitActivity({
    method: 'addAccessUser',
    create_date: new Date(),
    serial,
    entity: EntityTypes.TOPIC,
    issuer: issuer.serial,
    payload: { user }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN]
  })

  return true;
}

export async function removeAccessUser(this: TopicsModel, serial: string, user: string, issuer: User) {

  this.col.updateOne({ serial }, { $pull: { 'access.users': user } });

  this.pubSub.emitActivity({
    method: 'removeAccessUser',
    create_date: new Date(),
    serial,
    entity: EntityTypes.TOPIC,
    issuer: issuer.serial,
    payload: { user }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN]
  })

  return true;
}

export async function addAccessGroup(this: TopicsModel, serial: string, group: string, issuer: User) {

  this.col.updateOne({ serial }, { $addToSet: { 'access.groups': group } });

  this.pubSub.emitActivity({
    method: 'addAccessGroup',
    create_date: new Date(),
    serial,
    entity: EntityTypes.TOPIC,
    issuer: issuer.serial,
    payload: { group }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN]
  })

  return true;
}

export async function removeAccessGroup(this: TopicsModel, serial: string, group: string, issuer: User) {

  this.col.updateOne({ serial }, { $pull: { 'access.groups': group } });

  this.pubSub.emitActivity({
    method: 'removeAccessGroup',
    create_date: new Date(),
    serial,
    entity: EntityTypes.TOPIC,
    issuer: issuer.serial,
    payload: { group }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN]
  })

  return true;
}