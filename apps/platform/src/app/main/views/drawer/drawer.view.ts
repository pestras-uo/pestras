/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, HostBinding, TemplateRef } from '@angular/core';
import { take } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { SessionState } from '@pestras/frontend/state';
import { Router } from '@angular/router';
import { Role } from '@pestras/shared/data-model';


@Component({
  selector: 'main-drawer',
  templateUrl: './drawer.view.html',
  styleUrls: ['./drawer.view.scss']
})
export class DrawerView {
  private dialogRef: DialogRef | null = null;
  
  readonly roles = Role;
  
  preloader = false;
  full = false;

  @HostBinding('class.open')
  get isOpen() { return this.full; }
  @HostBinding('class.close')
  get isClose() { return !this.full; }

  constructor(
    private session: SessionState,
    private dialog: Dialog,
    private router: Router
  ) { }

  nav(url: string[], query = {}) {
    this.router.navigate(url, { queryParams: query });
    this.full = false;
  }

  openModal(tmp: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(tmp);
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  logout() {
    this.preloader = true;
    this.session.logout()
      .pipe(take(1))
      .subscribe(() => {
        this.closeModal();
        this.router.navigate(['/signin'])
      });
  }
}
