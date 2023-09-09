/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from "@angular/core";

export interface StatorConfig {
  development: boolean;
}

export const STATOR_CONFIG = new InjectionToken<StatorConfig>('STATOR_CONFIG');

// general
// ------------------------------------------------------------------------------------
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

// selection util types
// ------------------------------------------------------------------------------------
export type Query<T extends Record<string, any>> = Partial<Record<keyof T, T[keyof T]>>;
export type Filter<T> = (doc: T) => boolean;


// Update util type
// ------------------------------------------------------------------------------------
export type UpdateMode = 'replace' | 'merge' | 'deepMerge';

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