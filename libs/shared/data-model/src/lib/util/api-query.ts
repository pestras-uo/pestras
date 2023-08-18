/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiQuery<T extends Record<string, any>> {
  skip: number | null;
  limit: number | null;
  search: any | null;
  sort: Partial<Record<keyof T, 1 | -1>> | null;
  select: Partial<Record<keyof T, 1 | 0>> | null;
}

export interface ApiQueryResults<T> {
  count: number;
  results: T[];
}