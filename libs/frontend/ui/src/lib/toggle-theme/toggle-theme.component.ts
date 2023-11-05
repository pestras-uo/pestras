/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */

import { Component } from '@angular/core';
import { ToggleThemeService } from './toggle-theme.service';
import { map } from 'rxjs';

@Component({
  selector: 'toggle-theme',
  templateUrl: './toggle-theme.component.html'
})
export class ToggleTheme {
  readonly icons = {
    light: '🌙',
    dark: '☀️'
  };

  isDarkMode$ = this.toggleThemeService.isDarkMode$.pipe(
    map((isDark) => (isDark ? 'dark' : 'light') as 'light' | 'dark')
  );

  constructor(private toggleThemeService: ToggleThemeService) { }

  toggleDarkMode(): void {
    this.toggleThemeService.toggleDarkMode();
  }
}
