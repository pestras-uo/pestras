/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pui-slide-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiSlideShow implements OnChanges, OnDestroy {
  fading = -1;
  active = 0;
  length = 0;
  timer?: any;


  @Input({ required: true })
  images: string[] = [];
  @Input()
  wait = 15;

  ngOnChanges() {
    this.length = this.images.length;
    this.active = 0;
    this.fading = -1;

    this.timer && clearInterval(this.timer);

    if (this.length > 1)
      this.start();
  }

  ngOnDestroy(): void {
    this.timer && clearInterval(this.timer);
  }

  start() {
    this.timer = setInterval(() => {
      this.fading = this.active;
      this.active = this.active + 1 === this.length ? 0 : this.active + 1;

      setTimeout(() => this.fading = -1, 1000);

    }, this.wait * 1000);
  }
}
