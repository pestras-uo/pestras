import { EntityTypes, Report, User } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { ReportsModel } from ".";

export type CreateReportInput = Pick<Report, 'topic' | 'title'>;

export async function create(
  this: ReportsModel,
  input: CreateReportInput,
  issuer: User
) {
  const date = new Date();
  const report: Report = {
    ...input,
    serial: Serial.gen("RPT"),
    collaborators: [],
    slides: [],
    slides_order: [],
    views: [],
    is_active: true,
    create_date: date,
    last_modified: date,
    owner: issuer.serial
  };

  await this.col.insertOne(report);

  this.channel.emitActivity({
    create_date: date,
    issuer: issuer.serial,
    method: 'create',
    serial: report.serial,
    entity: EntityTypes.REPORT
  });

  return report;
}