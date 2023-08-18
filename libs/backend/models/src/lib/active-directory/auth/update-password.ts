import { AuthModel } from ".";

export async function updatePassword(this: AuthModel, user_serial: string, password: string) {
  await this.col.updateOne(
    { user: user_serial },
    { $set: { password, last_modified: new Date() } }
  );

  return true;
}