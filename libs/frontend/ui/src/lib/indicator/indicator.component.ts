/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'pui-indicator',
  template: `<div [class]="'indicator ' + state + ' ' + size"></div>`,
  styleUrls: ['./indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiIndicator implements OnChanges {
  state: 'green' | 'orange' | 'red' | 'blink' = 'green';

  @Input({ required: true })
  value!: number;
  @Input({ required: true })
  levels!: [orange: number, red: number, blink?: number];
  @Input()
  size: 'small' | 'large' | '' = '';

  ngOnChanges() {
    if (this.value < this.levels[0])
      this.state = 'green';
    else if (this.value < this.levels[1])
      this.state = 'orange';
    else {
      if (this.levels[2] && this.value >= this.levels[2])
        this.state = 'blink';
      else
        this.state = 'red';
    }
  }
}