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