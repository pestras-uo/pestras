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
  readonly collapse = new Set<number>();
  
  preloader = false;

  @HostBinding('class')
  hostCLass = 'bg-surface1 hide-scroll color-scheme-dark'

  constructor(
    private session: SessionState,
    private dialog: Dialog,
    private router: Router
  ) { }

  toggleCollapse(index: number) {
    this.collapse.has(index)
      ? this.collapse.delete(index)
      : this.collapse.add(index);
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
