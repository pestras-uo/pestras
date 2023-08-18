/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { PortalModule, CdkPortal } from '@angular/cdk/portal';

import { PuiIcon } from '../icon/icon.directive';

@Component({
  selector: 'pui-hint',
  standalone: true,
  imports: [CommonModule, PuiIcon, OverlayModule, PortalModule],
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiHint {
  visible = false;
  ref!: OverlayRef;

  @ViewChild(CdkPortal) hintBox!: CdkPortal;
  @ViewChild('pivot') pivot!: ElementRef;

  constructor(private overlay: Overlay) {}

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.pivot.nativeElement)
      .withPush(true)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
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
    this.ref = this.overlay.create(this.getOverlayConfig());
    this.ref.attach(this.hintBox);
    this.ref.backdropClick().subscribe(() => this.hide())
  }

  private hide(): void {
    this.ref.detach();
  }
}