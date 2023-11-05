import { Component } from '@angular/core';
import { RegionsState } from '@pestras/frontend/state';
import { ToastService } from '@pestras/frontend/ui';
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
export class AppComponent {
  constructor(
    protected contra: ContraService,
    protected readonly toast: ToastService,
    protected readonly sse: SSEService,
    protected readonly regions: RegionsState,
    protected readonly orgunits: RegionsState,
  ) {}
}
