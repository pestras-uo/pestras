import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { PuiSideDrawerComponent } from "./side-drawer.component";
import { PuiSideDrawer } from "./side-drawer.service";

@NgModule({
  declarations: [
    PuiSideDrawerComponent
  ],
  imports: [
    CommonModule,
    PortalModule
  ],
  exports: [
    PuiSideDrawerComponent
  ]
})
export class PuiSideDrawerModule {

  static forRoot(): ModuleWithProviders<PuiSideDrawerModule> {

    return {
      ngModule: PuiSideDrawerModule,
      providers: [PuiSideDrawer]
    }
  }
}