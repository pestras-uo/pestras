import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';

export type ThemeName = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly localStorageKey = 'themeName';

  private theme = new BehaviorSubject<ThemeName>('light');

  readonly theme$ = this.theme.pipe(
    tap((theme) => {
      this.updateBodyClass(theme);
      this.saveThemeState(theme);
    }),
    shareReplay(1)
  );

  constructor() {
    this.theme.next(this.loadThemeState());
  }

  toggleDarkMode() {
    this.theme.next(this.theme.value === 'dark' ? 'light' : 'dark');
  }

  private updateBodyClass(theme: ThemeName) {
    if (theme === 'dark') {
      document.body.classList.add('color-scheme-dark');
      document.body.classList.remove('color-scheme-light');
    } else {
      document.body.classList.add('color-scheme-light');
      document.body.classList.remove('color-scheme-dark');
    }
  }

  private saveThemeState(theme: ThemeName) {
    localStorage.setItem(this.localStorageKey, theme);
  }

  private loadThemeState(): ThemeName {
    return localStorage.getItem(this.localStorageKey) as ThemeName ?? 'light';
  }
}
