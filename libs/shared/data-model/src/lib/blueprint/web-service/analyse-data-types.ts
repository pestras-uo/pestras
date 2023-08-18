import { parseValue } from '../../util';
import { Field, createField } from '../fields';

export function analyseData(data: Record<string, any>[]) {

  if (data.length === 0)
    return [];

  const fields: Field[] = [];
  const keys: [string, boolean][] = Object.keys(data[0]).map(k => [k, false]);

  let index = 0;
  let record = data[index]

  while (fields.length !== keys.length && record) {

    for (const state of keys) {
      if (state[1])
        continue;

      const value = parseValue(record[state[0]]);

      if (value === null)
        continue;

      fields.push(createField({
        name: state[0],
        display_name: state[0],
        type: 'double'
      }));

      state[1] = true;
    }

    record = data[++index];
  }

  return fields;
}