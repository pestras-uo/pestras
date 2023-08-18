import { BaseAnalysis, EntityTypes } from "@pestras/shared/data-model";
import { AnalysisModel } from ".";

export type UpdateAnalysisInput = Omit<BaseAnalysis, 'create_date' | 'last_modified'>;

export async function update(
  this: AnalysisModel,
  serial: string,
  input: UpdateAnalysisInput,
  issuer: string
) {
    const date = new Date();

    await this.col.updateOne({ serial }, { $set: { ...input, last_modified: date } });

    this.pubSub.emitActivity({
      issuer,
      create_date: date,
      method: 'update',
      serial,
      entity: EntityTypes.ANALYSIS,
      payload: input
    });

    return date;
}