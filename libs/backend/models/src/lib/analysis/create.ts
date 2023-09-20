import { BaseAnalysis, EntityTypes } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { AnalysisModel } from ".";

export type CreateAnalysisInput = Omit<BaseAnalysis, 'create_date' | 'last_modified' | 'serial'>;

export async function create(
  this: AnalysisModel,
  input: CreateAnalysisInput,
  issuer: string
) {
    const date = new Date();
    const analysis: BaseAnalysis = {
      serial: Serial.gen("ANZ"),
      ...input,
      create_date: date,
      last_modified: date
    }

    await this.col.insertOne(analysis);

    this.channel.emitActivity({
      issuer,
      create_date: date,
      method: 'create',
      serial: analysis.serial,
      entity: EntityTypes.ANALYSIS
    });

    return analysis;
}