import { Workspace, WorkspaceDashboardSlide, WorkspacePin } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util'; 
import { Model } from "../model";

export class WorkspaceModel extends Model<Workspace> {

  getByOwner(owner: string) {
    return this.col.findOne({ owner });
  };

  create(owner: string) {
    return this.col.insertOne({ owner, groups: [], pins: [], slides: [] });
  }

  async addGroup(owner: string, name: string) {
    const group = { serial: Serial.gen("WGP"), name };

    await this.col.updateOne({ owner }, { $push: { groups: group } });

    return group.serial;
  }

  async updateGroup(owner: string, group: string, name: string) {
    await this.col.updateOne({ owner, 'groups.serial': group }, { $set: { 'groups.$.name': name } });

    return true;
  }

  async removeGroup(owner: string, group: string) {
    await this.col.updateOne({ owner }, { $pull: { groups: { serial: group }, pins: { group } } });

    return true
  }

  async addPin(owner: string, pin: WorkspacePin) {
    await this.col.updateOne({ owner }, { $push: { pins : pin } });

    return true;
  }

  async removePin(owner: string, pin: string) {
    await this.col.updateOne({ owner }, { $pull: { pins: { serial: pin } } });

    return true;
  }

  async addSlide(owner: string, slide: WorkspaceDashboardSlide) {
    await this.col.updateOne({ owner }, { $push: { slides: slide } });

    return true;
  }

  async removeSlide(owner: string, slide: string) {
    await this.col.updateOne({ owner }, { $pull: { slides: { slide } } });

    return true;
  }
}