import { Component, OnInit } from '@angular/core';
import { ToggleThemeService } from './toggle-theme.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ToggleTheme {
  isDarkMode = false;
  constructor(private toggleThemeService: ToggleThemeService) {}

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.toggleThemeService.toggleDarkMode();
  }
}
