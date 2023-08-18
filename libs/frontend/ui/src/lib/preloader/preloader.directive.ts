/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @angular-eslint/directive-selector */
import { ComponentRef, Directive, Input, OnChanges, OnDestroy, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { PreloaderComponent } from './preloader.component';

@Directive({
  selector: '[preloader]'
})
export class PuiPreloader implements OnChanges, OnDestroy {
  private componentRef?: ComponentRef<any>;

  @Input()
  preloader?: boolean | null = false;
  @Input()
  preloaderMsg?: string;
  @Input()
  preloaderBg: 'transparent' | 'surface1' | 'surface2' | 'surface3' = 'surface2';


  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly tmpl: TemplateRef<any>,
    private readonly renderer: Renderer2
  ) { }

  ngOnChanges(): void {
    this.clean();

    if (this.preloader) {
      if (this.preloader) {
        this.componentRef = this.vcr.createComponent(PreloaderComponent, {
          projectableNodes: this.preloaderMsg ? [[this.renderer.createText(this.preloaderMsg)]] : []
        });

        this.componentRef.location.nativeElement.classList.add(this.preloaderBg || 'surface2');
      }

    } else {
      this.vcr.createEmbeddedView(this.tmpl);
    }
  }

  ngOnDestroy(): void {
    this.componentRef && this.componentRef.destroy();
  }

  clean() {
    this.vcr.clear();
    this.componentRef && this.componentRef.destroy();
  }
}
