import { ModuleWithProviders, NgModule } from '@angular/core';
import { EnvService, Environment, PESTRAS_ENV } from './frontend-env.service';

@NgModule()
export class EnvModule {

  static forRoot(env: Environment): ModuleWithProviders<EnvModule> {

    return {
      ngModule: EnvModule,
      providers: [
        { provide: PESTRAS_ENV, useValue: env },
        EnvService
      ]
    }
  }
}
