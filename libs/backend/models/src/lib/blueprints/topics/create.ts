import { Topic, EntityTypes, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { HttpError, HttpCode } from "@pestras/backend/util";
import { TopicsModel } from ".";

export type CreateTopicInput = Pick<Topic, 'blueprint' | 'parent' | 'name'>;

export async function create(
  this: TopicsModel,
  input: CreateTopicInput, 
  issuer: User
) {

  if (input.blueprint && await this.nameExists(input.blueprint, input.name))
    throw new HttpError(HttpCode.CONFLICT, 'nameAlreadyExists');

  const date = new Date()
  const bpi: Topic = {
    ...input,
    create_date: date,
    last_modified: date,
    serial: Serial.gen('TPC'),
    owner: issuer.serial
  };

  await this.col.insertOne(bpi);

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'create',
    serial: bpi.serial,
    entity: EntityTypes.TOPIC
  });

  return bpi;
}