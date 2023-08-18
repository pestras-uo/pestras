/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, TemplateRef } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

export interface SideDrawerConfig {
  dismissable?: boolean;
  context?: any;
}

@Injectable()
export class PuiSideDrawer {
  private _content = new BehaviorSubject<{ content: any, config?: SideDrawerConfig; } | null>(null);

  public readonly content$ = this._content.asObservable();

  attach(c: TemplateRef<any>, config?: SideDrawerConfig) {
    this._content.next({ content: c, config })
  }

  close() {
    this._content.next(null);
  }
}