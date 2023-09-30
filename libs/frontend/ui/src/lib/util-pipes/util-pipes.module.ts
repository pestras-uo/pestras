import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayFilterPipe } from './array-filter.pipe';
import { ArrayFindPipe } from './array-find.pipe';
import { ArrayMapPipe } from './array-map.pipe';
import { ArraySlicePipe } from './array-slice.pipe';
import { FnPipe } from './fn.pipe';
import { IsDirPipe } from './is-dir.pipe';
import { ArrayIncludePipe } from './array-include.pipe';
import { ArrayDistinctPipe } from './array-distinct.pipe';
import { TrimTextPipe } from './trim-text.pipe';
import { TimePipe } from './time.pipe';
import { RandomColorPipe } from './random-color.pipe';
import { DocsPathPipe } from './docs-path.pipe';
import { PUI_UTIL_PIPES_CONFIG, PuiUtilPipesConfig } from './config';
import { SafeUrlPipe } from './safe-url.pipe';



@NgModule({
  declarations: [
    ArrayFilterPipe,
    ArrayFindPipe,
    ArrayMapPipe,
    ArraySlicePipe,
    FnPipe,
    IsDirPipe,
    ArrayIncludePipe,
    ArrayDistinctPipe,
    TrimTextPipe,
    TimePipe,
    RandomColorPipe,
    DocsPathPipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ArrayFilterPipe,
    ArrayFindPipe,
    ArrayMapPipe,
    ArraySlicePipe,
    FnPipe,
    IsDirPipe,
    ArrayIncludePipe,
    ArrayDistinctPipe,
    TrimTextPipe,
    TimePipe,
    RandomColorPipe,
    DocsPathPipe,
    SafeUrlPipe
  ]
})
export class PuiUtilPipesModule {

  static forRoot(config?: PuiUtilPipesConfig): ModuleWithProviders<PuiUtilPipesModule> {

    return {
      ngModule: PuiUtilPipesModule,
      providers: [
        { provide: PUI_UTIL_PIPES_CONFIG, useValue: config }
      ]
    };
  }
}
