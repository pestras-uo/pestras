/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */

import { Component } from '@angular/core';
import { ToggleThemeService } from './toggle-theme.service';
import { map } from 'rxjs';

@Component({
  selector: 'toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
export class ToggleTheme {
  constructor(private toggleThemeService: ToggleThemeService) {}

  isDarkMode$ = this.toggleThemeService.isDarkMode$.pipe(
    map((isdark) => (isdark ? 'dark' : 'light'))
  );

  toggleDarkMode(): void {
    this.toggleThemeService.toggleDarkMode();
  }
}
