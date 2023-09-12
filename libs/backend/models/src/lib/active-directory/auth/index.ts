import { Auth } from "@pestras/shared/data-model";
import { Model } from "../../model";

export class AuthModel extends Model<Auth> {

  // getters
  // ---------------------------------------------------------------------------------------
  getAll(this: AuthModel, projection?: Document) {
    const cursor = this.col.find({});
  
    return projection
      ? cursor.project<Auth>(projection).toArray()
      : cursor.toArray();
  }

  async getByUserSerial(this: AuthModel, serial: string, projection?: unknown) {
    return await this.col.findOne({ user: serial }, { projection });
  }


  // util
  // ---------------------------------------------------------------------------------------
  async exists(this: AuthModel, user_serial: string) {
    return (await this.col.countDocuments({ user: user_serial })) > 0;
  }


  // create
  // ---------------------------------------------------------------------------------------
  async create(auth: Pick<Auth, 'user' | 'password'>) {
    const date = new Date();

    await this.col.insertOne({
      user: auth.user,
      password: auth.password,
      create_date: date,
      last_modified: date
    });

    return date;
  }

  // update password
  // ---------------------------------------------------------------------------------------
  async updatePassword(this: AuthModel, user_serial: string, password: string) {
    await this.col.updateOne(
      { user: user_serial },
      { $set: { password, last_modified: new Date() } }
    );
  
    return true;
  }
}