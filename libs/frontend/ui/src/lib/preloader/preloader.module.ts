import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { PreloaderComponent } from "./preloader.component";
import { PuiPreloader } from "./preloader.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [PreloaderComponent, PuiPreloader],
  exports: [PuiPreloader, PreloaderComponent]
})
export class PuiPreloaderModule {}