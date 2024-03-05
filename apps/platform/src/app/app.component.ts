import { Component, OnInit } from '@angular/core';
import { OrgunitsState, RegionsState } from '@pestras/frontend/state';
import { ThemeService, ToastService } from '@pestras/frontend/ui';
import { ContraService } from '@pestras/frontend/util/contra';
import { SSEService } from '@pestras/frontend/state';

@Component({
  selector: 'pestras-root',
  template: `

    <ng-container *preloader="contra.loading$ | async">
      
      <router-outlet></router-outlet>
    </ng-container>
    <pui-side-drawer></pui-side-drawer>
    <pui-toast [trigger$]="toast.trig"></pui-toast>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    protected contra: ContraService,
    protected readonly toast: ToastService,
    protected readonly sse: SSEService,
    protected readonly regions: RegionsState,
    protected readonly orgunits: OrgunitsState,
    protected readonly themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.themeService.theme$
      .subscribe(theme => {
        document.getElementById('gisTheme')?.setAttribute(
          'href',
          theme === 'dark'
            ? 'https://js.arcgis.com/4.28/@arcgis/core/assets/esri/themes/dark/main.css'
            : 'https://js.arcgis.com/4.28/@arcgis/core/assets/esri/themes/light/main.css'
        );
      });
  }
}
