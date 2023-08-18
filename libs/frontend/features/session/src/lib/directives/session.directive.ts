/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { User } from '@pestras/shared/data-model';
import { Subscription } from 'rxjs';
import { StatorChannel } from '@pestras/frontend/util/stator';
import { SessionEnd, SessionStart } from '@pestras/frontend/state';

class Context {
  constructor(public readonly $implicit: User) { }
}

@Directive({
  selector: '[session]'
})
export class SessionDirective implements OnInit, OnDestroy {
  private startSub?: Subscription;
  private endSub?: Subscription;

  @Input()
  sessionElse?: TemplateRef<any>

  constructor(
    private readonly channel: StatorChannel,
    private readonly vcr: ViewContainerRef,
    private readonly tmpl: TemplateRef<Context>
  ) { }

  ngOnInit(): void {
    this.startSub = this.channel.select(SessionStart)
      .subscribe(session => {
        setTimeout(() => {
          this.vcr.clear();
  
          this.vcr.createEmbeddedView(this.tmpl, {
            $implicit: session
          });
        })
      });

    this.endSub = this.channel.select(SessionEnd)
      .subscribe(() => {
        this.vcr.clear();

        if (this.sessionElse) 
          this.vcr.createEmbeddedView(this.sessionElse);
      });
  }

  ngOnDestroy(): void {
    !!this.startSub && this.startSub.unsubscribe();
    !!this.endSub && this.endSub.unsubscribe();
  }

  static ngTemplateContextGuard(_: SessionDirective,
    ctx: unknown): ctx is Context {
    return true
  };
}
