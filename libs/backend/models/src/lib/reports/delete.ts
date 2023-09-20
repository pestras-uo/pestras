import { EntityTypes, User } from "@pestras/shared/data-model";
import { ReportsModel } from ".";

export async function deleteReport(
  this: ReportsModel,
  serial: string,
  issuer: User
) {

  await this.col.deleteOne({ serial });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: new Date(),
    method: 'delete',
    serial,
    entity: EntityTypes.REPORT
  });

  return true;
}