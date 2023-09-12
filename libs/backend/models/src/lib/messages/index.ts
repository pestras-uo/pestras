/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, MessagingInbox } from "@pestras/shared/data-model";
import { Model } from "../model";
import { Collection, Db } from "mongodb";
import { GetGroupBySerial, GetGroupsByUser, getMessagesByGroup } from "./read";
import { createGroup, createMessage, CreateMeassageInput } from "./create";
import { addUser, removeUser } from "./users";
import { deleteMessage, leaveGroup } from "./delete";

export { CreateMeassageInput };

export class MessagesModel extends Model<MessagingInbox> {
  protected messages!: Collection<Message>;

  constructor() {
    super('uo', 'messagesGroups');
  }

  protected override onConnect(db: Db): void {
    super.onConnect(db);
    this.messages = db.collection("messages");
  }

  getGroupsByUser: (user: string, projection?: any) => Promise<MessagingInbox[]> = GetGroupsByUser.bind(this);
  getGroupBySerial: (serial: string, projection?: any) => Promise<MessagingInbox> = GetGroupBySerial.bind(this);
  getMessagesByGroup: (inbox: string, skip?: number, limit?: number) => Promise<Message[]> = getMessagesByGroup.bind(this);

  createGroup: (parties: string[], issuer: string) => Promise<MessagingInbox> = createGroup.bind(this);
  createMessage: (inbox: string, input: CreateMeassageInput, issuer: string) => Promise<Message> = createMessage.bind(this);

  addUser: (inbox: string, user: string, issuer: string) => Promise<boolean> = addUser.bind(this);
  removeUser: (inbox: string, user: string) => Promise<boolean> = removeUser.bind(this);

  deleteMessage: (serial: string, issuer: string) => Promise<Date> = deleteMessage.bind(this);
  leaveGroup: (serial: string, issuer: string) => Promise<boolean> = leaveGroup.bind(this);
}