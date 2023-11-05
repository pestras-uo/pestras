import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToggleThemeService {
  private readonly localStorageKey = 'darkMode';

  private isDarkModeSubject = new BehaviorSubject<boolean>(
    this.loadDarkModeState()
  );

  isDarkMode$: Observable<boolean> = this.isDarkModeSubject
    .pipe(
      tap((isDarkMode) => {
        this.updateBodyClass(isDarkMode);
        this.saveDarkModeState(isDarkMode);
      }),
      shareReplay(1)
    );

  toggleDarkMode() {
    const isDarkMode = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(isDarkMode);
  }

  private updateBodyClass(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add('color-scheme-dark');
    } else {
      document.body.classList.remove('color-scheme-dark');
    }
  }

  private saveDarkModeState(isDarkMode: boolean) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(isDarkMode));
  }

  private loadDarkModeState(): boolean {
    const savedState = localStorage.getItem(this.localStorageKey);
    return savedState ? JSON.parse(savedState) : false;
  }
}
