/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stats, TypedEntity, parseValue } from "../../../util";

export interface DataVizTranspose {
  type: 'transpose'
  name: string;
  logical: boolean;
  true_value: any;
  false_value: any;
  target: string;
  method: Stats.DescriptiveStatsProps;
}

export function transposeRecords<T extends Record<string, any>>(data: T[], opt: DataVizTranspose): T[] {
  const tMap = new Map<string, any[]>();
  const record: any = {};

  if (opt.logical) {
    for (const r of data) {
      const parsedValue = parseValue(r[opt.name]);
      const value = parsedValue ? opt.true_value ?? 'YES' : opt.false_value ?? 'NO';
      const g = tMap.get(value)

      if (!g)
        tMap.set(value, [r]);
      else
        g.push(r);
    }

  } else {
    for (const r of data) {
      const value = r[opt.name];
      const g = tMap.get(value);

      if (!g)
        tMap.set(value, [r]);
      else
        g.push(r);
    }
  }

  for (const [key, list] of tMap)
    record[key] = Stats[opt.method](list.map(r => r[opt.target]));

  return [record];
}

export function transposeRecordsFields(fields: TypedEntity[], data: any[], options: DataVizTranspose): TypedEntity[] {
  const output: TypedEntity[] = [];
  const targetField = fields.find(f => f.name === options.target);

  if (!targetField || data.length === 0)
    return output;

  for (const key of data[0])
    if (Object.prototype.hasOwnProperty.call(data[0], key))
      output.push({ ...targetField, name: key, display_name: key });

  return output;
}