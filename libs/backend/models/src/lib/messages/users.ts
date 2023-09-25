import { Activity, EntityTypes } from "@pestras/shared/data-model";
import { MessagesModel } from ".";

export async function addUser(
  this: MessagesModel,
  inbox: string,
  user: string,
  issuer: string
) {
  await this.col.updateOne({ serial: inbox }, { $addToSet: { parties: user } });

  this.channel.emit('messages', {
    method: 'addUser',
    entity: EntityTypes.INBOX,
    serial: inbox,
    create_date: new Date(),
    issuer: issuer
  } as Activity);

  return true;
}


export async function removeUser(
  this: MessagesModel,
  inbox: string,
  user: string
) {
  await this.col.updateOne({ serial: inbox }, { $pull: { parties: user } });

  return true;
}