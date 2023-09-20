import { EntityTypes, Report, User } from "@pestras/shared/data-model";
import { ReportsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type UpdateReportInput = Pick<Report, 
  'title'
>;

export async function update(
  this: ReportsModel,
  serial: string,
  input: UpdateReportInput,
  issuer: User
) {
  if (await this.titleExists(input.title, serial))
    throw new HttpError(HttpCode.CONFLICT, "titleAlreadyExissts");

  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { ...input, last_modified: date } });

  this.channel.emitActivity({
    issuer: issuer.serial,
    create_date: date,
    method: 'update',
    serial,
    entity: EntityTypes.REPORT
  });

  return date;
}