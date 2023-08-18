import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceTogglePinView } from './views/workspace-toggle-pin/workspace-toggle-pin.view';
import { WorkspaceToggleSlideView } from './views/workspace-toggle-slide/workspace-toggle-slide.view';
import { PuiIcon, PuiPreloaderModule, PuiSelectInput, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ContraModule } from '@pestras/frontend/util/contra';



@NgModule({
  declarations: [
    WorkspaceTogglePinView,
    WorkspaceToggleSlideView
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    // Util
    ContraModule,
    DialogModule,
    // Pui
    PuiPreloaderModule,
    PuiIcon,
    PuiUtilPipesModule,
    PuiSelectInput
  ],
  exports: [
    WorkspaceTogglePinView,
    WorkspaceToggleSlideView
  ]
})
export class WorkspaceFeatureModule { }
