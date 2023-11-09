/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[togglePasswordVisibility]',
  exportAs: 'tpv',
})
export class togglePasswordVisibilityDirective {
  public isPasswordVisible = false;

  @Input({ required: true })
  public togglePasswordVisibility!: HTMLInputElement;

  @HostListener('click')
  onClick() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.togglePasswordVisibility.setAttribute(
      'type',
      this.isPasswordVisible ? 'text' : 'password'
    );
  }

  constructor(private el: ElementRef) {}
}
