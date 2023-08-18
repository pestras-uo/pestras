import { Injectable } from '@angular/core';
import { PuiToastOptions } from './toast.component';
import { Subject } from 'rxjs';

@Injectable()
export class ToastService {

  public readonly trig = new Subject<PuiToastOptions>();

  public msg(msg: string, options: Omit<PuiToastOptions, 'msg'> = {}) {
    this.trig.next({ msg, ...(options || {}) });
  }
}
