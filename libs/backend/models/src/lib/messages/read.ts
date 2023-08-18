/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessagesModel } from ".";

export async function GetGroupsByUser(
  this: MessagesModel,
  user: string,
  projection?: any
) {
  return this.col.find({ parties: user }, { projection }).toArray();
}

export async function GetGroupBySerial(
  this: MessagesModel,
  serial: string,
  projection?: any
) {
  return this.col.findOne({ serial }, { projection });
}

export async function getMessagesByGroup(
  this: MessagesModel,
  inbox: string,
  skip = 0,
  limit = 20
) {
  return this.messages.find({ serial: { $regex: new RegExp(`_${inbox}$`)} }, { sort: [['create_date', 1]], skip, limit }).toArray();
}