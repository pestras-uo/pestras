/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  private readonly fontSizeKey = 'fontSize';
  private readonly defaultFontSize = 14;

  private fontSizeSubject = new BehaviorSubject<number>(this.getFontSize());

  getFontSize(): number {
    return +localStorage.getItem(this.fontSizeKey)! || this.defaultFontSize;
  }

  setFontSize(fontSize: number): void {
    localStorage.setItem(this.fontSizeKey, fontSize.toString());
    this.fontSizeSubject.next(fontSize); // Notify subscribers about the font size change
  }

  resetFontSize(): void {
    localStorage.removeItem(this.fontSizeKey);
    this.fontSizeSubject.next(this.defaultFontSize); // Notify subscribers about the font size reset
  }

  fontSizeChanges(): Observable<number> {
    return this.fontSizeSubject.asObservable();
  }
}
