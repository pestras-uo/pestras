/* eslint-disable @typescript-eslint/no-explicit-any */
import { Auth } from "@pestras/shared/data-model";
import { Document } from "mongodb";
import { AuthModel } from ".";

export function getAll(this: AuthModel, projection?: Document) {
  const cursor = this.col.find({});

  return projection
    ? cursor.project<Auth>(projection).toArray()
    : cursor.toArray();
}

export async function getByUserSerial(this: AuthModel, serial: string, projection?: any) {
  return await this.col.findOne({ user: serial }, { projection });
}