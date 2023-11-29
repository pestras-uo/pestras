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
        class="btn-danger btn-round btn-tiny btn-icon"
        (click)="decreaseFontSize()"
        [disabled]="isMinFontSize()"
      >
        <i size="small" puiIcon="minus"></i>
      </button>

      <button
        class="btn-primary btn-tiny btn-round btn-icon"
        (click)="increaseFontSize()"
        [disabled]="isMaxFontSize()"
      >
        <i size="small" puiIcon="add"></i>
      </button>
    </div>
  `,
  styles: [
    `
      .fontsize {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    `,
  ],
})
export class FontSizeComponent implements OnInit {
  @Output() fontSizeChanged = new EventEmitter<number>();
  @Input() defaultFontSize = 14;
  @Input() maxFontSize = 20;
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
      this.currentFontSize += 6;
      this.updateFontSize();
    }
  }

  decreaseFontSize(): void {
    if (this.currentFontSize > this.minFontSize) {
      this.currentFontSize -= 6;
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
    allElements.forEach((element: Node) => {
      if (element instanceof HTMLElement) {
        element.style.fontSize = `${this.currentFontSize}px`;
      }
    });

    this.emitFontSizeChanged();
  }

  private emitFontSizeChanged(): void {
    this.fontSizeChanged.emit(this.currentFontSize);
  }
}
