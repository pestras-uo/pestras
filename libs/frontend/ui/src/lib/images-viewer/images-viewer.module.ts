import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuiImagesViewer } from './images-viewer.component';
import { DialogModule } from '@angular/cdk/dialog';
import { PuiIcon } from '../icon/icon.directive';



@NgModule({
  declarations: [
    PuiImagesViewer
  ],
  imports: [
    CommonModule,
    DialogModule,
    PuiIcon
  ],
  exports: [
    PuiImagesViewer
  ]
})
export class PuiImagesViewerModule { }
