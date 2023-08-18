import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ContraModule } from '@pestras/frontend/util/contra';
import { StatorModule } from '@pestras/frontend/util/stator';
import { SessionState, StateModule } from '@pestras/frontend/state';
import { PuiGoogleMapModule, PuiIcon, PuiPreloaderModule, PuiSideDrawerModule, PuiToast, PuiUtilPipesModule } from '@pestras/frontend/ui';
import { QuillModule } from 'ngx-quill';
import { environment } from '../environments/environment';
import { initApp } from './app.initializer';
import { AppInterceptor } from './app.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabledBlocking',
      bindToComponentInputs: true
    }),
    ContraModule.forRoot({
      languages: [
        { name: 'العربية', dir: 'rtl', key: 'ar' },
        { name: 'English', dir: 'ltr', key: 'en' }
      ],
      resources: [
        { name: 'content', path: '/assets/content', expireMS: 1000 * 60 * 60 }
      ]
    }),
    StatorModule.forRoot({ development: !environment.production }),
    StateModule.forRoot({ api: environment.api }),
    PuiIcon.forRoot('assets/svg'),
    PuiPreloaderModule,
    PuiToast.forRoot(),
    PuiUtilPipesModule.forRoot({ docsPath: environment.docs }),
    PuiGoogleMapModule.forRoot('AIzaSyB0HpChbfkOcdI_3CZy3fS5YCKn7I7g0iY'),
    PuiSideDrawerModule.forRoot(),
    QuillModule.forRoot({
      modules: {
        toolbar: [
          [{ header: [3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['link'],
          [{ 'align': [] }, { 'direction': 'rtl' }],
          ['blockquote', 'code-block', 'formula', 'script'],
          ['clean'],
        ]
      }
    })
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initApp, deps: [SessionState], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
