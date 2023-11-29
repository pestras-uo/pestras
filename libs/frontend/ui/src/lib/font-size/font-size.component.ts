/* eslint-disable @angular-eslint/component-selector */

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  booleanAttribute,
} from '@angular/core';
import { FontSizeService } from './font-size.service';

@Component({
  selector: 'pui-font-size',
  template: `
    <div class="fontsize">
      <button
        class="btn-icon btn-round"
        (click)="decreaseFontSize()"
        [disabled]="isMinFontSize()"
      >
        -
      </button>

      <button
        class="btn-icon btn-round"
        (click)="increaseFontSize()"
        [disabled]="isMaxFontSize()"
      >
        +
      </button>
    </div>
  `,
  styles: [
    `
      .reset-button {
        margin-left: 10px;
      }
      .fontsize {
        display: flex;
        align-items: center;
      }
      button {
        margin: 0 5px;
      }
      
    `,
  ],
})
export class FontSizeComponent implements OnInit {
  @Output() fontSizeChanged = new EventEmitter<number>();
  @Input() defaultFontSize = 14;
  @Input() maxFontSize = 30;
  @Input() minFontSize = 10;

  @Input({ transform: booleanAttribute })
  dark = false;

  currentFontSize!: number;

  constructor(private fontService: FontSizeService) {}

  ngOnInit(): void {
    this.currentFontSize =
      this.fontService.getFontSize() || this.defaultFontSize;
    this.updateFontSize();
  }

  increaseFontSize(): void {
    if (this.currentFontSize < this.maxFontSize) {
      this.currentFontSize += 2;
      this.updateFontSize();
    }
  }

  decreaseFontSize(): void {
    if (this.currentFontSize > this.minFontSize) {
      this.currentFontSize -= 2;
      this.updateFontSize();
    }
  }

  isMaxFontSize(): boolean {
    return this.currentFontSize >= this.maxFontSize;
  }

  isMinFontSize(): boolean {
    return this.currentFontSize <= this.minFontSize;
  }

  private updateFontSize(): void {
    this.fontService.setFontSize(this.currentFontSize);

    const allElements = document.querySelectorAll('*');
    allElements.forEach((element: any) => {
      element.style.fontSize = `${this.currentFontSize}px`;
    });

    this.emitFontSizeChanged();
  }

  private emitFontSizeChanged(): void {
    this.fontSizeChanged.emit(this.currentFontSize);
  }
}
