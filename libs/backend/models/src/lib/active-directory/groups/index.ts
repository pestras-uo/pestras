import { EntityTypes, Role, UsersGroup } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { Model } from "../../model";

export class UsersGroupsModel extends Model<UsersGroup> {

  getAll() {
    return this.col.find().toArray();
  }

  getBySerial(serial: string) {
    return this.col.findOne({ serial });
  }

  async create(name: string, issuer: string) {
    const date = new Date();
    const group: UsersGroup = {
      serial: Serial.gen("GRP"),
      name,
      create_date: date,
      last_modified: date
    };

    await this.col.insertOne(group);

    this.channel.emitActivity({
      method: 'create',
      create_date: date,
      serial: group.serial,
      entity: EntityTypes.GROUP,
      issuer
    }, {
      roles: [Role.ADMIN],
      orgunits: ['*']
    });

    return group;
  }

  async update(serial: string, name: string, issuer: string) {
    const date = new Date();

    await this.col.updateOne({ serial }, { $set: { name, last_modified: date } });

    this.channel.emitActivity({
      method: 'update',
      create_date: date,
      serial: serial,
      entity: EntityTypes.GROUP,
      issuer,
      payload: { name }
    }, {
      roles: [Role.ADMIN],
      orgunits: ['*']
    });

    return date;
  }

  async delete(serial: string, issuer: string) {
    await this.col.deleteOne({ serial });

    this.channel.emitActivity({
      method: 'delete',
      create_date: new Date(),
      serial: serial,
      entity: EntityTypes.GROUP,
      issuer
    }, {
      roles: [Role.ADMIN],
      orgunits: ['*']
    });

    return true;
  }
}