/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */

import { Component } from '@angular/core';
import { ThemeService } from './toggle-theme.service';

@Component({
  selector: 'toggle-theme',
  templateUrl: './toggle-theme.component.html'
})
export class ToggleTheme {
  readonly icons = {
    light: '🌙',
    dark: '☀️'
  };

  constructor(protected themeService: ThemeService) { }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
