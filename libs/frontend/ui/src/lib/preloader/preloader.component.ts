/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'pui-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreloaderComponent {

  @Input()
  set bg(color: string) {
    this.background = color;
  }

  @HostBinding('class')
  background?: string;
}
