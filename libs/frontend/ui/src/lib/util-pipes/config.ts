import { InjectionToken } from "@angular/core";

export interface PuiUtilPipesConfig {
  docsPath?: string
}

export const PUI_UTIL_PIPES_CONFIG = new InjectionToken<PuiUtilPipesConfig>('PUI_UTIL_PIPES_CONFIG');