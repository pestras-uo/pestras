/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[puiInfiniteScroll]'
})
export class PuiInfiniteScroll implements OnInit {

  private domElm!: HTMLDivElement;

  @HostListener('scroll')
  onScroll() {
    if ((this.domElm.clientHeight + this.domElm.scrollTop) >= (this.domElm.scrollHeight - this.margin))
      this.reached.emit();
  }

  @Input()
  margin = 1;

  @Output()
  reached = new EventEmitter();

  constructor(private elm: ElementRef) { }

  ngOnInit(): void {
    this.domElm = this.elm.nativeElement;
  }
}
