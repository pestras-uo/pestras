import { DateUnit } from "../../util";

export enum QueryOptionUse {
  DEFAULT,
  ALWAYES,
  INIT_ONLY
}

export interface WSQueryOptions {
  serial: string;
  key: string;
  // built in date helpers
  // $$NOW: current date
  value: string;
  // %Y/%m/%d : data format
  date_format: string | null;
  add_to_date: { unit: DateUnit, amount: number; }[];
  dest: 'body' | 'search' | 'path';
  // for first request only
  use: QueryOptionUse;
}