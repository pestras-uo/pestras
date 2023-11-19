/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggrPipeline, DataStore, MergeStage, OutStage, castTypedEntityValue, selectionsToPipeline } from "@pestras/shared/data-model";

export function generateResponseAggrPipeline(data: any, ds: DataStore) {
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

  return pipeline;
}

export function generateResponseData(data: any[], ds: DataStore) {
  const selection = ds.web_service.selection;

  return data.map(item => {
    const outItem: any = {};
    for (const prop in item) {
      const field = selection.find(f => f.field === prop);
      
      if (!field)
        continue;

      const rawValue = item[prop];
      let value: any;

      if (rawValue === null)
        value = field.onNull;
      else {
        value = castTypedEntityValue(item[prop], field.type);
  
        if (value === null)
          value = field.onError;
      }

      outItem[field.as ?? field.field] = value;
    }

    return outItem;
  })
  .filter(Boolean);
}