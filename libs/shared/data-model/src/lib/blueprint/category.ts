export const categoryTypes = ['nominal', 'ordinal', 'ordinal_range'] as const;

export type CategoryType = typeof categoryTypes[number];

export interface Category {
  serial: string;
  blueprint: string;
  title: string;
  type: CategoryType;
  value: number | string | [number, number];
  levels: number | null;
  level: number;

  create_date: Date;
  last_modified: Date;
}