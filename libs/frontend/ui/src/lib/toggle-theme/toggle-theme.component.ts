/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */

import { Component } from '@angular/core';
import { ToggleThemeService } from './toggle-theme.service';

@Component({
  selector: 'toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
export class ToggleTheme {
  isDarkMode = false;
  constructor(private toggleThemeService: ToggleThemeService) {}

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.toggleThemeService.toggleDarkMode();
  }
}
