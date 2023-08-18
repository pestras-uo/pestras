import { Auth } from "@pestras/shared/data-model";
import { AuthModel } from ".";

export async function create(this: AuthModel, auth: Pick<Auth, 'user' | 'password'>) {
  const date = new Date();

  await this.col.insertOne({
    user: auth.user,
    password: auth.password,
    create_date: date,
    last_modified: date
  });

  return date;
}