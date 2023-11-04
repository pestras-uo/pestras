import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToggleThemeService {
  private readonly localStorageKey = 'darkMode';

  public isDarkModeSubject = new BehaviorSubject<boolean>(
    this.loadDarkModeState()
  );
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor() {
    this.isDarkModeSubject.subscribe((isDarkMode) => {
      this.updateBodyClass(isDarkMode);
      this.saveDarkModeState(isDarkMode);
    });
  }

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
