/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataViz, EntityTypes } from "@pestras/shared/data-model";
import { DataVizModel } from ".";

export type UpdateDataVizInput = Omit<BaseDataViz<any>, 'create_date' | 'last_modified'>;

export async function update(
  this: DataVizModel,
  serial: string,
  input: UpdateDataVizInput,
  issuer: string
) {
    const date = new Date();

    await this.col.updateOne({ serial }, { $set: { ...input, last_modified: date } });

    this.channel.emitActivity({
      issuer,
      create_date: date,
      method: 'update',
      serial,
      entity: EntityTypes.DATA_VIZ
    });

    return date;
}