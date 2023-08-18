/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @angular-eslint/directive-selector */
import { ModuleWithProviders, OnChanges } from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';

let _iconsDir = 'assets/icons';

const iconstSizes = ['tiny', 'small', 'mid', 'large', 'larger', 'fit'] as const;
type IconsSize = typeof iconstSizes[number];

const iconColors = ['primary', 'accent', 'success', 'warn', 'danger', 'text1', 'text2', 'text3', 'text4', 'white', ''] as const;
type IconColor = typeof iconColors[number];

@Directive({
  standalone: true,
  selector: '[puiIcon]'
})
export class PuiIcon implements OnChanges {

  @Input({ required: true })
  puiIcon = 'user';
  @Input()
  size: IconsSize = 'mid';
  @Input()
  color: IconColor = '';

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    const elm: HTMLElement = this.el.nativeElement;
    const style = elm.style;

    style.setProperty('-webkit-mask', `url(${_iconsDir}/${this.puiIcon}.svg) no-repeat center`);
    style.setProperty('mask', `url(${_iconsDir}/${this.puiIcon}.svg) no-repeat center`);

    const classes = new Set<string>(
      elm.classList.value.split(' ')
        .filter(c => !iconstSizes.some(s => `icon-${s}` === c) && !iconColors.some(o => `bg-${o}` === c))
    );

    classes.add('icon');

    !!this.size && classes.add(`icon-${this.size}`);
    !!this.color && classes.add(`bg-${this.color}`);

    elm.classList.value = [...classes].join(' ');
  }

  static forRoot(iconsDir: string): ModuleWithProviders<PuiIcon> {
    _iconsDir = iconsDir || 'assets/icons';

    return {
      ngModule: PuiIcon
    }
  }
}