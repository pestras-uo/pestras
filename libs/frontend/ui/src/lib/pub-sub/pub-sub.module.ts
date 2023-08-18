import { ModuleWithProviders, NgModule } from "@angular/core";
import { PubSubService } from "./pub-sub.service";

@NgModule()
export class PubSubModule {

  static forRoot(): ModuleWithProviders<PubSubModule> {

    return {
      ngModule: PubSubModule,
      providers: [PubSubService]
    }
  }
}