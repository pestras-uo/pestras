import { Dashboard, EntityTypes, User } from "@pestras/shared/data-model";
import { DashboardsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type UpdateDashboardInput = Pick<Dashboard, 'title'>;

export async function update(
  this: DashboardsModel,
  serial: string,
  input: UpdateDashboardInput,
  issuer: User
) {
  if (await this.titleExists(input.title, serial))
    throw new HttpError(HttpCode.CONFLICT, "titleAlreadyExissts");

  const date = new Date();

  await this.col.updateOne({ serial }, { $set: { ...input, last_modified: date } });

  this.pubSub.emitActivity({
    create_date: date,
    issuer: issuer.serial,
    method: 'update',
    serial,
    entity: EntityTypes.DASHBOARD
  });

  return date;
}