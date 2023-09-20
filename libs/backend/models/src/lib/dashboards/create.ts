import { Dashboard, EntityTypes, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { DashboardsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export type CreateDashboardInput = Pick<Dashboard, 'topic' | 'title'>;

export async function create(
  this: DashboardsModel,
  input: CreateDashboardInput,
  issuer: User
) {
  if (await this.titleExists(input.title))
    throw new HttpError(HttpCode.CONFLICT, "titleAlreadyExissts");

  const date = new Date();
  const dashboard: Dashboard = {
    ...input,
    serial: Serial.gen("DBR"),
    create_date: date,
    is_active: true,
    last_modified: date,
    owner: issuer.serial,
    slides: [],
    slides_order: [],
    views: [],
    collaborators: []
  };

  await this.col.insertOne(dashboard);

  this.channel.emitActivity({
    create_date: date,
    issuer: issuer.serial,
    method: 'create',
    serial: dashboard.serial,
    entity: EntityTypes.DASHBOARD
  });

  return dashboard;
}