/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity, EntityTypes, Message, MessagingInbox } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { MessagesModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function createGroup(
  this: MessagesModel,
  parties: string[],
  issuer: string
) {
  const exists = await this.col.countDocuments({ parties: { $all: parties, $size: parties.length } });

  if (exists)
    throw new HttpError(HttpCode.CONFLICT, 'groupAlreadyExists');

  const group: MessagingInbox = {
    admin: issuer,
    serial: Serial.gen('IBX'),
    create_date: new Date(),
    notify: [],
    parties
  };

  await this.col.insertOne(group);

  return group;
}

export type CreateMeassageInput = Pick<Message, 'content' | 'owner' | 'type'>;

export async function createMessage(
  this: MessagesModel,
  inbox: string,
  input: CreateMeassageInput,
  issuer: string
) {
  const message: Message = {
    serial: Serial.gen('MSG', inbox),
    create_date: new Date(),
    delete_date: null,
    content: input.content,
    owner: input.owner,
    type: input.type
  };

  await this.messages.insertOne(message);

  this.channel.emit('messages', {
    method: 'create',
    entity: EntityTypes.MESSAGE,
    create_date: message.create_date,
    payload: { message },
    issuer,
    serial: message.serial
  } as Activity<any>);

  return message;
}