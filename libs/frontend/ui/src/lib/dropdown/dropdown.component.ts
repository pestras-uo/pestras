/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, ViewChild, Input } from '@angular/core';
import { OverlayModule, Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { PortalModule, CdkPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule],
  selector: 'pui-dropdown',
  template: `
    <ng-template cdk-portal>
      <div [class]="dir">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `
})
export class PuiDropdown {

  private overlayRef!: OverlayRef;

  readonly dir = document.documentElement.getAttribute('dir');

  @ViewChild(CdkPortal) public contentTemplate!: CdkPortal;

  @Input()
  set visible(isVisivle: boolean) {
    setTimeout(() => {
      isVisivle ? this.show() : this.hide();
    });
  }

  @Input({ required: true })
  origin!: HTMLElement;

  constructor(
    private overlay: Overlay
  ) { }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPush(true)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  show() {
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.contentTemplate);
    this.overlayRef.backdropClick().subscribe(() => this.hide());
  }

  hide(): void {
    this.overlayRef.detach();
  }

}