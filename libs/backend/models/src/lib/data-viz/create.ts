/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataViz, EntityTypes } from "@pestras/shared/data-model";
import { Serial } from '@pestras/shared/util';
import { DataVizModel } from ".";

export type CreateDataVizInput = Omit<BaseDataViz<any>, 'serial' | 'create_date' | 'last_modified'>;

export async function create(
  this: DataVizModel,
  input: CreateDataVizInput,
  issuer: string
) {
    const date = new Date();
    const dataViz: BaseDataViz = {
      serial: Serial.gen("ANZ"),
      ...input,
      create_date: date,
      last_modified: date
    }

    await this.col.insertOne(dataViz);

    this.pubSub.emitActivity({
      issuer,
      create_date: date,
      method: 'create',
      serial: dataViz.serial,
      entity: EntityTypes.DATA_VIZ
    });

    return dataViz;
}