import { Topic, EntityTypes, User } from "@pestras/shared/data-model";
import { TopicsModel } from ".";

export type UpdateTopicInput = Pick<Topic, 'name'>;

export async function update(
  this: TopicsModel,
  serial: string,
  input: UpdateTopicInput, 
  issuer: User
) {
  const date = new Date();

  await this.col.updateOne({ serial }, {
    $set: { ...input, last_modified: date }
  });

  this.pubSub.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'update',
    serial,
    entity: EntityTypes.TOPIC,
    payload: input
  });

  return date;
}