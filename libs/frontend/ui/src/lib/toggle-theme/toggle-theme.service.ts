import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToggleThemeService {
  private readonly localStorageKey = 'darkMode'; // Key to store the theme mode in localStorage
  public isDarkModeSubject = new BehaviorSubject<boolean>(
    this.loadDarkModeState()
  ); // Load initial state from localStorage
  isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  darkModeToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

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
