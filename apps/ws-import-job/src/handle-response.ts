/* eslint-disable @typescript-eslint/no-explicit-any */
import { dataRecordsModel } from "@pestras/backend/models";
import { generateResponseAggrPipeline } from "@pestras/backend/util";
import { DataStore } from "@pestras/shared/data-model";
import { Serial } from "@pestras/shared/util";

export async function handleResponse(data: any, ds: DataStore) {
  const pipeline = generateResponseAggrPipeline(data, ds);
  const temp_table = Serial.gen("TMP");

  await dataRecordsModel.col(temp_table).insertMany(data);
  await dataRecordsModel.col(temp_table).aggregate(pipeline.compile()).toArray();
  
  dataRecordsModel.dropCol(temp_table);
}