/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DataVizLimit {
  type: 'limit';
  count: number;
  end: boolean;
}

export function limitRecords<T extends Record<string, any>>(data: T[], opt: DataVizLimit): T[] {
  return opt.end
    ? data.slice(-1 * opt.count)
    : data.slice(0, opt.count);
}