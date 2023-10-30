import { Component, TemplateRef } from '@angular/core';
import { NotificationsState } from '@pestras/frontend/state';
import { PuiSideDrawer } from '@pestras/frontend/ui';

@Component({
  selector: 'pestras-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
})
export class NotificationsListComponent {

  readonly notifications$ = this.state.data$;

  constructor(
    private state: NotificationsState,
    private drawer: PuiSideDrawer
  ) {}

  openSideDrawer(tmp: TemplateRef<unknown>) {
    this.drawer.attach(tmp, { dismissable: true });
  }

  closeDrawer() {
    this.drawer.close();
  }

  setSeen(serial: string) {
    this.state.setSeen(serial)
      .subscribe(() => null);
  }
}
