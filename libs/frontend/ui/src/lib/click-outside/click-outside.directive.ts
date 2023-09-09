/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[puiClickOutside]',
  standalone: true,
})
export class PuiClickOutsideDirective {

  @Output()
  puiClickOutside = new EventEmitter();
  
  @HostListener('document:click', ['$event'])
  onClick(event: PointerEvent) {
    const nativeEl: HTMLElement = this.elRef.nativeElement;

    if (!nativeEl.contains(event.target as Node))
      this.puiClickOutside.emit();
  }

  constructor(private elRef: ElementRef) {}
}
