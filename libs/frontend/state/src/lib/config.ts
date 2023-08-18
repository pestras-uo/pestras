import { InjectionToken } from "@angular/core";

export interface StateConfig {
  api: string;
}

export const STATE_CONFIG = new InjectionToken<StateConfig>('STATE_CONFIG');