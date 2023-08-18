import { ModuleWithProviders, NgModule } from '@angular/core';
import { STATOR_CONFIG, StatorConfig } from './types';
import { StatorChannel } from './channel.service';



@NgModule({})
export class StatorModule {

  static forRoot(config: StatorConfig): ModuleWithProviders<StatorModule> {

    return {
      ngModule: StatorModule,
      providers: [
        { provide: STATOR_CONFIG, useValue: config },
        StatorChannel
      ]
    }
  }

}
