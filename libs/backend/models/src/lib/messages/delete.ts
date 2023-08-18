/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity, EntityTypes } from "@pestras/shared/data-model";
import { MessagesModel } from ".";

export async function deleteMessage(
  this: MessagesModel,
  serial: string,
  issuer: string
) {
  const date = new Date();
  await this.messages.updateOne({ serial }, { $set: { delete_date: date }});

  this.pubSub.emit('messages', {
    method: 'delete',
    entity: EntityTypes.MESSAGE,
    serial,
    create_date: date,
    issuer
  } as Activity<any>);

  return date;
}



export async function leaveGroup(
  this: MessagesModel,
  serial: string,
  issuer: string
) {
  const inbox = await this.getGroupBySerial(serial, { parties: 1 });

  if (!inbox)
    return true;

  // if last party then delete inbox and all messages
  if (inbox.parties.length === 1 && inbox.parties[0] === issuer) {
    await this.col.deleteOne({ serial })
    await this.messages.deleteMany({ serial: { $regex: new RegExp(`_${serial}$`) } });

    return true;
  }

  await this.col.updateOne({ serial }, { $pull: { parties: issuer } });

  this.pubSub.emit('messages', {
    method: 'leaveGroup',
    entity: EntityTypes.INBOX,
    serial,
    issuer,
    create_date: new Date()
  } as Activity);

  return true;
}