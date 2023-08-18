import { UsersModel } from ".";

export async function exists(this: UsersModel, serial: string) {
  return (await this.col.countDocuments({ serial })) > 0;
}

export async function usernameExists(this: UsersModel, username: string) {
  return (await this.col.countDocuments({ username })) > 0;
}