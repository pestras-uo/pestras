import { Message, MessagingInbox } from "@pestras/shared/data-model";
import { Model } from "../model";
import { Collection, Db } from "mongodb";
import { GetGroupBySerial, GetGroupsByUser, getMessagesByGroup } from "./read";
import { createGroup, createMessage } from "./create";
import { addUser, removeUser } from "./users";
import { deleteMessage, leaveGroup } from "./delete";

export class MessagesModel extends Model<MessagingInbox> {
  protected messages!: Collection<Message>;

  constructor() {
    super('uo', 'messagesGroups');
  }

  protected override onConnect(db: Db): void {
    super.onConnect(db);
    this.messages = db.collection("messages");
  }

  getGroupsByUser = GetGroupsByUser.bind(this);
  getGroupBySerial = GetGroupBySerial.bind(this);
  getMessagesByGroup = getMessagesByGroup.bind(this);

  createGroup = createGroup.bind(this);
  createMessage = createMessage.bind(this);

  addUser = addUser.bind(this);
  removeUser = removeUser.bind(this);

  deleteMessage = deleteMessage.bind(this);
  leaveGroup = leaveGroup.bind(this);
}