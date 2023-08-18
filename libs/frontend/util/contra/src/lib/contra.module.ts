import { ModuleWithProviders, NgModule } from '@angular/core';
import { ContraDirective } from './contra.directive';
import { ContraFillPipe } from './contra-fill.pipe';
import { HttpClientModule } from '@angular/common/http';
import { ContraService } from './contra.service';
import { CONTRA_CONFIG, ContraConfig } from './config';
import { ContraLanguagesPipe } from './contra-languages.pipe';
import { ContraLangPipe } from './contra-lang.pipe';
import { ContraLangDirective } from './contra-lang.directive';



@NgModule({
  declarations: [
    ContraDirective,
    ContraLangDirective,
    ContraFillPipe,
    ContraLanguagesPipe,
    ContraLangPipe
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    ContraDirective,
    ContraLangDirective,
    ContraFillPipe,
    ContraLanguagesPipe,
    ContraLangPipe
  ]
})
export class ContraModule {

  static forRoot(config: ContraConfig): ModuleWithProviders<ContraModule> {

    return {
      ngModule: ContraModule,
      providers: [
        { provide: CONTRA_CONFIG, useValue: config },
        ContraService
      ]
    }
  }

}
