import { ModuleWithProviders, NgModule } from "@angular/core";
import { ToastService } from "./toast.service";
import { PuiToast } from "./toast.component";
import { CommonModule } from "@angular/common";
import { PuiIcon } from "../icon/icon.directive";

@NgModule({
  declarations: [PuiToast],
  imports: [CommonModule, PuiIcon],
  exports: [PuiToast]
})
export class PuiToastModule {

  static forRoot(): ModuleWithProviders<PuiToastModule> {

    return {
      ngModule: PuiToastModule,
      providers: [ToastService]
    }
  }
}