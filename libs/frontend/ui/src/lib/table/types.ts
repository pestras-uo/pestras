/* eslint-disable @typescript-eslint/no-explicit-any */
export enum PuiTableColumnType {
  TEXT,
  NUMBER,
  LIST,
  DATE,
  ACTION,
  BOOL,
  TEMPLATE,
  LOCATION
}

export enum PuiTableFooterColumnType {
  TEXT = 0,
  NUMBER,
  DATE = 3,
  BOOL = 5
}

export interface PuiColumnConfig<T = any> {
  key: string;
  format?: string;
  isAmount?: boolean;
  default?: string;
  srcArray?: any[];
  srcKeyValueArray?: { key: string; value: any; }[];
  prefix?: string;
  template?: string;
  suffix?: string;
  cssClass?: string;
  skip?: boolean | ((item: T) => boolean);
  formatter?: (key: string, value: any, row: T) => any;
}

export interface PuiTableColumn<T = any> extends PuiColumnConfig<T> {
  header: string;
  type?: PuiTableColumnType;
  searchable?: boolean;
  link?: string;
  icon?: string;
  actionClass?: string;
  hidden?: boolean;
  length?: boolean;
}

export interface PuiTableFooterColumn<T = any> extends PuiColumnConfig<T> {
  type: PuiTableFooterColumnType;
}

export interface PuiTableIndicator<T = any> {
  key: keyof T;
  header: string;
  levels: [orange: number, red: number, blink?: number];
}

export interface PuiTableConfig<T = any> {
  indexing?: boolean;
  rowPointer?: boolean;
  columns: PuiTableColumn<T>[];
  // footers?: { name: string; columns: PuiTableFooterColumn[] }[];
  rowLink?: string;
  hint?: string;
  indicator?: PuiTableIndicator;
  // query
  search?: boolean;
  pagination?: number;
  sort?: (keyof T)[];
}

export interface PuiTableActionOutput<T = any> {
  key: string;
  row: T;
}

export interface PuiTableQuery {
  page?: number;
  sort?: Record<string, -1 | 1>;
  search?: string
}