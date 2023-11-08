import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuiIcon } from '../icon/icon.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { PuiUtilPipesModule } from '../util-pipes/util-pipes.module';
import { PuiPasswordInput } from './password-input.component';

@NgModule({
  declarations: [PuiPasswordInput],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PuiIcon,
  ],
  exports: [PuiPasswordInput],
})
export class PuiPasswordInputModule {}
