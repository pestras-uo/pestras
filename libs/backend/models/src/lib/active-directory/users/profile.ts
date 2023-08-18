import { UsersModel } from ".";

export async function updateProfile(
  this: UsersModel,
  serial: string, 
  fullname: string, 
  mobile: string, 
  email: string
) {
  const date = new Date();

  await this.col.updateOne(
    { serial },
    { $set: { fullname, mobile, email, last_modified: date } }
  );

  return date;
}