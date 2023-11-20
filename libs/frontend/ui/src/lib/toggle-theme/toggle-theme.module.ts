import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleTheme } from './toggle-theme.component';
import { ThemeService } from './toggle-theme.service';
import { PuiIcon } from '../icon/icon.directive';

@NgModule({
  declarations: [ToggleTheme],
  imports: [CommonModule, PuiIcon],
  exports: [ToggleTheme],
})
export class ToggleThemeModule {
  static forRoot(): ModuleWithProviders<ToggleThemeModule> {
    return {
      ngModule: ToggleThemeModule,
      providers: [ThemeService],
    };
  }
}
