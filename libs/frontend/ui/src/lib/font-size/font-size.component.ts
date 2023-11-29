/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { FontSizeService } from './font-size.service';
import { untilDestroyed } from '../reactive';

@Component({
  selector: 'pui-font-size',
  template: `
    <div class="flex align-items-center gap-2">
      <button
        class="btn-danger btn-round btn-tiny btn-icon"
        (click)="decreaseFontSize()"
        [disabled]="currentFontSize === minFontSize"
      >
        <i size="tiny" puiIcon="text_decrease"></i>
      </button>

      <button
        class="btn-primary btn-tiny btn-round btn-icon"
        (click)="increaseFontSize()"
        [disabled]="currentFontSize === maxFontSize"
      >
        <i size="tiny" puiIcon="text_increase"></i>
      </button>
      <button
        class="btn-success btn-tiny btn-round btn-icon"
        (click)="resetFontSize()"
        [disabled]="currentFontSize === 14"
      >
        <i size="tiny" puiIcon="restart"></i>
      </button>
    </div>
  `
})
export class FontSizeComponent implements OnInit {
  private ud = untilDestroyed();
  
  readonly maxFontSize = 18;
  readonly minFontSize = 10;

  currentFontSize!: number;

  constructor(private fontService: FontSizeService) { }

  ngOnInit(): void {
    this.fontService.fontSize$
      .pipe(this.ud())
      .subscribe((fontSize: number) => {
        this.currentFontSize = fontSize;
        this.updateFontSize();
      });
  }

  increaseFontSize(): void {
    this.fontService.setFontSize(this.currentFontSize + 2);
  }

  decreaseFontSize(): void {
    this.fontService.setFontSize(this.currentFontSize - 2);
  }

  resetFontSize(): void {
    this.fontService.resetFontSize();
  }

  isMaxFontSize(): boolean {
    return this.currentFontSize >= this.maxFontSize;
  }

  isMinFontSize(): boolean {
    return this.currentFontSize <= this.minFontSize;
  }

  private updateFontSize(): void {
    document.body.style.setProperty('--font-size', `${this.currentFontSize}px`);
  }
}
