import { EntityTypes, Role, User } from "@pestras/shared/data-model";
import { ClientApiModel } from ".";

export async function deleteClientApi(
  this: ClientApiModel,
  serial: string,
  issuer: User
) {
  await this.col.deleteOne({ serial });

  this.pubSub.emitActivity({
    method: 'delete',
    serial,
    entity: EntityTypes.CLIENT_API,
    create_date: new Date(),
    issuer: issuer.serial
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return true;
}