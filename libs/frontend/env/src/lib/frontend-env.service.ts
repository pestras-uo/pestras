import { Inject, Injectable, InjectionToken } from "@angular/core";

export interface Environment {
  env: string;
  api: string;
  docs: string;
}

export const PESTRAS_ENV = new InjectionToken<Environment>('PESTRAS_ENV');

@Injectable()
export class EnvService {

  constructor(@Inject(PESTRAS_ENV) readonly env: Readonly<Environment>) {}
}