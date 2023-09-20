import { EntityTypes, Role, User } from "@pestras/shared/data-model";
import { ClientApiModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function update(
  this: ClientApiModel,
  serial: string,
  clientName: string,
  issuer: User 
) {

  if (await this.nameExists(clientName, serial))
    throw new HttpError(HttpCode.CONFLICT, 'nameAlreadyExists');

  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { client_name: clientName, last_modified: date }});

  this.channel.emitActivity({
    method: 'update',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial,
    payload: { client_name: clientName },
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return date;
}