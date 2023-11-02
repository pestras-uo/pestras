export interface Category {
  serial: string;
  blueprint: string;
  title: string;
  ordinal: boolean;
  value: number | string;
  levels: number | null;
  level: number;

  create_date: Date;
  last_modified: Date;
}