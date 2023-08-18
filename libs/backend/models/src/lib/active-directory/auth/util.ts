import { AuthModel } from ".";

export async function exists(this: AuthModel, user_serial: string) {
  return (await this.col.countDocuments({ user: user_serial })) > 0;
}