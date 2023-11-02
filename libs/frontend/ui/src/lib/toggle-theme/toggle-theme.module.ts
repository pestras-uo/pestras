import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleTheme } from './toggle-theme.component';
import { ToggleThemeService } from './toggle-theme.service';

@NgModule({
  declarations: [ToggleTheme],
  imports: [CommonModule],
  exports: [ToggleTheme],
})
export class ToggleThemeModule {
  static forRoot(): ModuleWithProviders<ToggleThemeModule> {
    return {
      ngModule: ToggleThemeModule,
      providers: [ToggleThemeService],
    };
  }
}
