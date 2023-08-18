import { UsersModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function updateAvatar(this: UsersModel, serial: string, avatar: string | null) {
  const user = await this.getBySerial(serial, { avatar: 1 });
  const date = new Date();

  if (!user)
    throw new HttpError(HttpCode.NOT_FOUND, "userNotFound");

  await this.col.updateOne(
    { serial }, 
    { $set: { avatar: avatar || null, last_modified: date } }
  );

  return date;
}