import { EntityAccess } from "@pestras/shared/data-model";
import { Model } from "../model";

export class EntityAccessModel extends Model<EntityAccess> {

  getByEntity(entity: string) {
    return this.col.findOne({ entity });
  }

  async create(entity: string) {
    await this.col.insertOne({
      entity,
      orgunits: [],
      users: [],
      groups: []
    });

    return true;
  }

  async delete(entity: string) {
    await this.col.deleteOne({ entity });
    return true;
  }

  async addOrgunit(entity: string, orgunit: string) {
    await this.col.updateOne({ entity }, { $addToSet: { orgunits: orgunit } });
    return true;
  }

  async removeOrgunit(entity: string, orgunit: string) {
    await this.col.updateOne({ entity }, { $pull: { orgunits: orgunit } });
    return true;
  }

  async addUser(entity: string, user: string) {
    await this.col.updateOne({ entity }, { $addToSet: { users: user } });
    return true;
  }

  async removeUser(entity: string, user: string) {
    await this.col.updateOne({ entity }, { $pull: { users: user } });
    return true;
  }

  async addGroup(entity: string, group: string) {
    await this.col.updateOne({ entity }, { $addToSet: { groups: group } });
    return true;
  }

  async removeGroup(entity: string, group: string) {
    await this.col.updateOne({ entity }, { $pull: { groups: group } });
    return true;
  }
}