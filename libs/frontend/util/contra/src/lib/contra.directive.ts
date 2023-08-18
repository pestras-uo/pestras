/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContraService } from './contra.service';

class Context {
  constructor(
    public readonly $implicit: Record<string, any>,
    public readonly key: string,
    public readonly name: string,
    public readonly dir: string
  ) { }
}

@Directive({
  selector: '[contra]'
})
export class ContraDirective implements OnInit, OnDestroy {
  private sub?: Subscription;

  @Input() contraRes: string[] | undefined = [];

  constructor(
    private readonly service: ContraService,
    private readonly vcr: ViewContainerRef,
    private readonly tmpl: TemplateRef<Context>
  ) { }

  ngOnInit(): void {
    this.sub = this.service.select(...(this.contraRes || []))
      .subscribe(data => {
        if (!data)
          this.vcr.clear()
        else {
          const lang = this.service.currLang;

          if (lang) {
            this.vcr.clear();
            this.vcr.createEmbeddedView(this.tmpl, {
              $implicit: data,
              ...lang
            });
          }
        }
      });
  }

  ngOnDestroy(): void {
    !!this.sub && this.sub.unsubscribe();
  }

  static ngTemplateContextGuard(_: ContraDirective,
    ctx: unknown): ctx is Context {
    return true
  };

}
