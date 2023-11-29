/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  private readonly fontSizeKey = 'fontSize';
  private readonly defaultFontSize = 14;

  getFontSize(): number {
    return +localStorage.getItem(this.fontSizeKey)! ?? this.defaultFontSize;
  }

  setFontSize(fontSize: number): void {
    localStorage.setItem(this.fontSizeKey, fontSize.toString());
  }
}
