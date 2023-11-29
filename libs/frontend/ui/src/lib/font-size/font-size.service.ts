/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  private readonly fontSizeKey = 'fontSize';
  private readonly defaultFontSize = 14;

  private fontSizeSubject = new BehaviorSubject<number>(this.getFontSize());

  readonly fontSize$ = this.fontSizeSubject.pipe(distinctUntilChanged());

  private getFontSize(): number {
    return +localStorage.getItem(this.fontSizeKey)! || this.defaultFontSize;
  }

  setFontSize(fontSize: number): void {
    this.fontSizeSubject.next(fontSize); // Notify subscribers about the font size change
    localStorage.setItem(this.fontSizeKey, fontSize.toString());
  }

  resetFontSize(): void {
    this.fontSizeSubject.next(this.defaultFontSize); // Notify subscribers about the font size reset
    localStorage.removeItem(this.fontSizeKey);
  }
}
