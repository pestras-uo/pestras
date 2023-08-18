import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { ElementRef } from '@angular/core';

export function getOverlayConfig(overlay: Overlay, origin: ElementRef): OverlayConfig {
  const positionStrategy = overlay
    .position()
    .flexibleConnectedTo(origin.nativeElement)
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

  const scrollStrategy = overlay.scrollStrategies.reposition();
  return new OverlayConfig({
    positionStrategy: positionStrategy,
    scrollStrategy: scrollStrategy,
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-transparent-backdrop',
  });
}