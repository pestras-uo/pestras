import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontSizeComponent } from './font-size.component';
import { FontSizeService } from './font-size.service';
import { PuiIcon } from '../icon/icon.directive';

@NgModule({
  declarations: [FontSizeComponent],
  imports: [CommonModule, FormsModule,PuiIcon],
  providers: [FontSizeService],
  exports: [FontSizeComponent],
})
export class FontSizeModule {}
