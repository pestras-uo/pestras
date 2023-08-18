export interface Category {
  serial: string;
  blueprint: string;
  title: string;
  ordinal: boolean;
  value: number | string;

  create_date: Date;
  last_modified: Date;
}