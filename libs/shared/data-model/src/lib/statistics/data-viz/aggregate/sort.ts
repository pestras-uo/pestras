/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DataVizSortField {
  name: string;
  desc: boolean;
}

export interface DataVizSort {
  type: 'sort';
  fields: DataVizSortField[];
}

export function sortRecords<T extends Record<string, any>>(data: any[], opt: DataVizSort): T[] {

  return data.sort((a: any, b: any) => {

    for (const field of opt.fields) {
      const order = field.desc ? -1 : 1;
      let result: number;

      if (typeof a[field.name] === 'string')
        result = a[field.name].localeCompare(b[field.name]) * order;
      else
        result = (a[field.name] - b[field.name]) * order;

      if (result === 0)
        continue;

      return result;
    }

    return 0;
  });

}