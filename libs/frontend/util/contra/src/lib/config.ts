import { InjectionToken } from '@angular/core';

export interface ContraLanguage {
  name: string;
  key: string;
  dir: 'rtl' | 'ltr';
}

export interface ContraResourceConfig {
  name: string;
  path: string;
  expireMS: number;
}

export interface ContraConfig {
  languages: ContraLanguage[];
  resources: ContraResourceConfig[];
}

export const CONTRA_CONFIG = new InjectionToken<ContraConfig>('CONTRA_CONFIG');