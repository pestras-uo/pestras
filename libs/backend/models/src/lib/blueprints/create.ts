import { Blueprint, EntityTypes } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { BlueprintsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type CreateBlueprintInput = Pick<Blueprint, 'name' | 'orgunit'>;

export async function create(this: BlueprintsModel, input: CreateBlueprintInput, issuer: string) {

  if (await this.nameExists(input.name))
    throw new HttpError(HttpCode.CONFLICT, 'nameAlreadyExists');

  const date = new Date()
  const bp: Blueprint = {
    ...input,
    create_date: date,
    last_modified: date,
    owner: issuer,
    collaborators: [],
    serial: Serial.gen('BPT')
  };

  await this.col.insertOne(bp);

  this.channel.emitActivity({
    issuer: issuer,
    create_date: date,
    method: 'create',
    serial: bp.serial,
    entity: EntityTypes.BLUEPRINT
  }, {
    orgunits: [input.orgunit]
  });

  return bp;
}