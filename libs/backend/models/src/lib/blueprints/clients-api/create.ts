import { ClientApi, EntityTypes, Role, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { ClientApiModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type CreateClientApiInput = Pick<ClientApi, 'blueprint' | 'client_name'>;

export async function create(
  this: ClientApiModel,
  input: CreateClientApiInput,
  issuer: User
) {

  if (await this.nameExists(input.client_name))
    throw new HttpError(HttpCode.CONFLICT, 'nameAlreadyExists');

  const date = new Date();
  const cApi: ClientApi = {
    serial: Serial.gen("API"),
    ...input,
    active: true,
    create_date: date,
    last_modified: date,
    data_stores: [],
    ips: []
  };

  await this.col.insertOne(cApi);

  this.pubSub.emitActivity({
    method: 'create',
    serial: cApi.serial,
    entity: EntityTypes.CLIENT_API,
    create_date: date,
    issuer: issuer.serial
  }, {
    orgunits: [issuer.orgunit],
    roles: [Role.ADMIN, Role.DATA_ENG]
  });

  return cApi;
}