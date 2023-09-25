import { EntityTypes, User } from "@pestras/shared/data-model";
import { DashboardsModel } from ".";

export async function deleteDashboard(
  this: DashboardsModel,
  serial: string,
  issuer: User
) {

  await this.col.deleteOne({ serial });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: new Date(),
    method: 'delete',
    serial,
    entity: EntityTypes.DASHBOARD
  });

  return true;
}