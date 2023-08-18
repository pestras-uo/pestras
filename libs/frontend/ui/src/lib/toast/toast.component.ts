/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, Input, HostBinding, OnInit, OnDestroy, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { PuiIcon } from '../icon/icon.directive';
import { ToastService } from './toast.service';

export interface PuiToastOptions {
  msg: string;
  type?: 'info' | 'warn' | 'error' | 'loading' | 'success';
  dismiss?: boolean;
  duration?: number;
}

interface PuiToastInternalOptions extends PuiToastOptions {
  classes: { [key: string]: boolean };
  timerId: any;
  id: string;
}

@Component({
  selector: 'pui-toast',
  standalone: true,
  imports: [CommonModule, PuiIcon],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PuiToast implements OnInit, OnDestroy {

  toasts$ = new BehaviorSubject<PuiToastInternalOptions[]>([]);
  subscribtion?: Subscription;

  @Input({ required: true })
  trigger$!: Subject<PuiToastOptions>;

  @HostBinding('class.active')
  get hasToasts() {
    return this.toasts$.getValue()?.length;
  }

  static forRoot(): ModuleWithProviders<PuiToast> {
    return {
      ngModule: PuiToast,
      providers: [ToastService]
    }
  }

  ngOnInit(): void {
    this.subscribtion = this.trigger$.subscribe(options => {
      this.show(options);
    });
  }

  ngOnDestroy() {
    !!this.subscribtion && this.subscribtion.unsubscribe();
  }

  prepareClasses(toast: PuiToastInternalOptions) {
    toast.classes = {};
    toast.classes['Toast--animateIn'] = true;

    if (toast.type === 'error')
      toast.classes['Toast--error'] = true;
    else if (toast.type === 'success')
      toast.classes['Toast--success'] = true;
    else if (toast.type === 'warn')
      toast.classes['Toast--warning'] = true;
    else if (toast.type === 'loading')
      toast.classes['Toast--loading'] = true;
  }

  show(options: PuiToastOptions) {
    const toast: PuiToastInternalOptions = Object.assign({
      type: 'info',
      dismiss: false,
      id: [Math.random(), Math.random(), Math.random()].join('-'),
      timerId: null,
      classes: {}
    }, options);

    if (!toast.duration && !toast.dismiss)
      toast.duration = toast.msg.split(' ').length * 1000 + 1000;

    this.prepareClasses(toast);

    const toasts = [...this.toasts$.getValue(), toast];

    this.toasts$.next(toasts);

    setTimeout(() => {
      toast.classes['active'] = true;
    this.toasts$.next([...toasts]);
    });

    if (toast.duration)
      toast.timerId = setTimeout(() => this.dismiss(toast.id), toast.duration);
  }

  dismiss(id: string) {
    const toasts = this.toasts$.getValue();

    const index = toasts.findIndex(t => t.id === id);

    if (!toasts[index])
      return;

    toasts[index].classes['active'] = false;
    this.toasts$.next([...toasts]);

    // this.toasts[index].classes['Toast--animateIn'] = false;
    // this.toasts[index].classes['Toast--animateOut'] = true;

    if (toasts[index].timerId)
      clearTimeout(toasts[index].timerId);

    setTimeout(() => {
      this.toasts$.next(toasts.filter((_, idx) => idx !== index));
    }, 500);
  }

}
