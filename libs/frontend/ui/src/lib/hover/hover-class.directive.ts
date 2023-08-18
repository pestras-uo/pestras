/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[puiHover]',
  standalone: true
})
export class PuiHover implements OnChanges {
  add: string[] = [];
  remove: string[] = [];

  @Input({ required: true })
  puiHover = '';

  @HostListener('mouseenter')
  setter() {
    (this.el.nativeElement as HTMLElement).classList.add(...this.add);
    (this.el.nativeElement as HTMLElement).classList.remove(...this.remove);
  }

  @HostListener('mouseleave')
  remover() {
    (this.el.nativeElement as HTMLElement).classList.remove(...this.add);
    (this.el.nativeElement as HTMLElement).classList.add(...this.remove);
  }

  constructor(private readonly el: ElementRef) { }

  ngOnChanges(): void {
    this.add = [];
    this.remove = [];

    for (const c of this.puiHover.split(' '))
      if (c.startsWith('-'))
        this.remove.push(c.slice(1))
      else
        this.add.push(c);
  }
}
