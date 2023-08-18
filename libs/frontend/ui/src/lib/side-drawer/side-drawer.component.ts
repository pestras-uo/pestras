/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { Portal, TemplatePortal } from '@angular/cdk/portal';
import { Component, HostBinding, HostListener, OnInit, ViewContainerRef } from '@angular/core';
import { PuiSideDrawer, SideDrawerConfig } from './side-drawer.service';

@Component({
  selector: 'pui-side-drawer',
  template: `
    <div class="pui-side-drawer-wrapper" (click)="drawerClicked($event)">
      <ng-template [cdkPortalOutlet]="selectedPortal"></ng-template>
    </div>
  `,
  styles: [
    `
    :host {
      display: none;
      opacity: 0;
      position: fixed;
      z-index: 500;
      inset: 0;
      background-color: rgba(0,0,0,0.5);
      transition: opacity 200ms 100ms;

      &.active {
        display: block;
      }
      

      &.inn {
        opacity: 1;
        transition: opacity 200ms;

        .pui-side-drawer-wrapper {
          transition: transform 300ms ease-out 50ms, opacity 250ms 100ms;
          transform: translate(0, 0);
          opacity: 1;
        }
      }
    }

    .pui-side-drawer-wrapper {
      position: absolute;
      opacity: 0;
      transform: translate(-100%, 0);
      inset-block: 0;
      inset-inline-end: 0;
      background-color: #FFF;
      box-shadow: 0 0px 10px rgba(0,0,0,0.3);
      transition: transform 300ms ease-out 50ms, opacity 250ms;
    }
  `,
  ],
})
export class PuiSideDrawerComponent implements OnInit {
  selectedPortal: Portal<any> | null = null;
  config?: SideDrawerConfig | null = null;

  @HostBinding('class.active')
  active = false;
  @HostBinding('class.inn')
  inn = false;

  @HostListener('click')
  handleClick() {
    if (this.config?.dismissable)
      this.exit();
  }

  constructor(
    private readonly service: PuiSideDrawer,
    private readonly _viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.service.content$.subscribe((c) => {
      this.config = c?.config;

      if (!c)
        this.exit();
      else {
        this.selectedPortal = new TemplatePortal(c.content, this._viewContainerRef, c.config?.context);
        this.config = c.config;
        this.active = true;
        setTimeout(() => (this.inn = true));
      }
    });
  }

  drawerClicked(e: MouseEvent) {
    e.stopPropagation();
    return false;
  }

  exit() {
    this.config = null;
    this.inn = false;
    setTimeout(() => {
      this.active = false;
      this.selectedPortal = null;
    }, 500);
  }
}
