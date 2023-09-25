/* eslint-disable @typescript-eslint/no-explicit-any */
import { dataRecordsModel } from "@pestras/backend/models";
import { AggrPipeline, DataStore, MergeStage, OutStage, selectionsToPipeline } from "@pestras/shared/data-model";
import { Serial } from "@pestras/shared/util";

export async function handleResponse(data: any, ds: DataStore) {
  const temp_table = Serial.gen("TMP");

  await dataRecordsModel.col(temp_table).insertMany(data);

  const stages = selectionsToPipeline(data.settings.selection);
  const pipeline = new AggrPipeline(stages);

  if (data.settings.replace_existing)
    pipeline.add(new OutStage({ coll: ds.serial, db: null }, []));
  else
    pipeline.add(new MergeStage({
      into: ds.serial,
      whenMatched: 'replace',
      whenNotMatched: 'insert',
      on: null
    }));

  await dataRecordsModel.col(temp_table).aggregate(pipeline.compile()).toArray();
  dataRecordsModel.dropCol(temp_table);
}