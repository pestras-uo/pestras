/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stats, TypedEntity, createTypedEntity, parseValue } from "../../../util";

export interface GroupFieldCalc {
  field: string;
  new_name: string;
  method: Stats.DescriptiveStatsProps;
  display_name: string | null;
}

export interface GroupField {
  name: string;
  logical: boolean;
  logical_name: string | null;
  logical_display_name: string | null;
  true_value: any;
  false_value: any;
}

export interface DataVizGroup {
  type: 'group';
  by: GroupField[];
  calc: GroupFieldCalc[];
  count_name: string;
  count_display_name: string | null;
}

function calcList(list: any[], options: DataVizGroup) {
  const record: any = {};

  for (const opt of options.calc)
    record[opt.new_name] = Stats[opt.method](list.map(r => r[opt.field]));

  record[options.count_name] = list.length;

  return record;
}

function singleGroup(data: any[], options: DataVizGroup, index: number) {
  const by = options.by[index];
  const map = new Map<string, any[]>();
  const output: any[] = [];

  if (by.logical) {
    for (const r of data) {
      const parsedValue = parseValue(r[by.name]);
      const key = by.logical_name || by.name;
      const value = parsedValue ? by.true_value ?? 'YES' : by.false_value ?? 'NO';
      const g = map.get(value);

      r[key] = value;

      if (g === undefined)
        map.set(value, []);
      else
        g.push(r);
    }

  } else {
    for (const r of data) {
      const g = map.get(r[by.name]);

      if (g === undefined)
        map.set(r[by.name], []);
      else
        g.push(r);
    }
  }

  if (options.by.length > index + 1) {
    for (const [key, list] of map.entries())
      output.push(...singleGroup(list, options, index + 1).map(v => ({ ...v, [by.name]: key })));
  } else
    for (const [key, list] of map.entries())
      output.push({ ...calcList(list, options), [by.name]: key });

  return output;
}

export function groupRecords<T extends Record<string, any>>(data: T[], opt: DataVizGroup): T[] {
  return opt.by.length > 0 && data.length > 0
    ? singleGroup(data, opt, 0)
    : data;
}

export function groupRecordsFields(fields: TypedEntity[], options: DataVizGroup): TypedEntity[] {
  const output: TypedEntity[] = [];

  output.push(createTypedEntity({
    name: options.count_name,
    type: 'int',
    display_name: options.count_display_name || options.count_name
  }));

  for (const by of options.by) {
    if (by.logical) {
      output.push(createTypedEntity({
        name: by.logical_name ?? by.name,
        type: 'boolean',
        display_name: by.logical_display_name ?? by.logical_name ?? by.name
      }));

    } else {
      const field = fields.find(f => f.name === by.name);

      if (field)
        output.push(field);
    }
  }

  for (const calc of options.calc) {
    const field = fields.find(f => f.name === calc.field);

    if (!field)
      continue;

    if (['count', 'countDistinct', 'skewness', 'kurtosis'].includes(calc.method))
      output.push(createTypedEntity({
        name: calc.new_name,
        type: calc.method === 'count' || calc.method === 'countDistinct' ? 'int' : 'double',
        display_name: calc.display_name || calc.new_name
      }));
    else if (['years', 'months', 'days', 'hours', 'minutes', 'seconds'].includes(calc.method))
      output.push(createTypedEntity({
        name: calc.new_name,
        type: 'int',
        display_name: calc.display_name || calc.new_name,
        unit: calc.method
      }));
    else
      output.push(createTypedEntity({
        ...field,
        name: calc.new_name,
        display_name: calc.display_name ?? field.display_name
      }));
  }

  return output;
}