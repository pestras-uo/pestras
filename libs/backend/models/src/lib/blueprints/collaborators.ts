import { EntityTypes, Role, User } from "@pestras/shared/data-model";
import { BlueprintsModel } from ".";

export async function addCollaborator(
  this: BlueprintsModel,
  serial: string,
  collaborator: string,
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    {
      $addToSet: { collaborators: collaborator },
      $set: { last_modified: date }
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'addCollaborator',
    serial,
    entity: EntityTypes.BLUEPRINT,
    payload: { collaborator }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}

export async function removeCollaborator(
  this: BlueprintsModel,
  serial: string,
  collaborator: string,
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    {
      $pull: { collaborators: collaborator },
      $set: { last_modified: date }
    }
  );

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'removeCollaborator',
    serial,
    entity: EntityTypes.BLUEPRINT,
    payload: { collaborator }
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}