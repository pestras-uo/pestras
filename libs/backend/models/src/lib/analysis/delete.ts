import { EntityTypes } from "@pestras/shared/data-model";
import { AnalysisModel } from ".";

export async function deleteAnalysis(
  this: AnalysisModel,
  serial: string,
  issuer: string
) {
  const date = new Date();

  await this.col.deleteOne({ serial });

  this.channel.emitActivity({
    issuer,
    create_date: date,
    method: 'delete',
    serial,
    entity: EntityTypes.ANALYSIS
  });

  return { serial, date };
}