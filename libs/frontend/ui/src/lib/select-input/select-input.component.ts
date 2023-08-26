/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, HostListener, SimpleChanges, OnChanges, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, take } from 'rxjs';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { PuiIcon } from '../icon/icon.directive';
import { OverlayModule, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { PortalModule, CdkPortal } from '@angular/cdk/portal';
import { getOverlayConfig } from './util';
import { PuiUtilPipesModule } from '../util-pipes/util-pipes.module';

@Component({
  selector: 'pui-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PuiIcon, PortalModule, OverlayModule, PuiUtilPipesModule],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: PuiSelectInput },
    { provide: NG_VALIDATORS, multi: true, useExisting: PuiSelectInput }
  ]
})
export class PuiSelectInput implements OnChanges, ControlValueAccessor {
  private overlayRef!: OverlayRef;

  newOptions: any[] = [];
  optionsList: any[] = [];
  value: any = null;
  disabled = false;
  touched = false;
  searchControl = new FormControl("", { nonNullable: true });

  @HostListener('window:resize')
  public onWinResize(): void {
    this.syncWidth();
  }

  @Input({ required: true })
  list!: any[];
  @Input()
  labelRef: number | string = '';
  @Input({ transform: booleanAttribute })
  addNew = false;
  @Input({ transform: booleanAttribute })
  nullable = false;
  @Input()
  placeholder = 'no item';

  @ViewChild(CdkPortal)
  public contentTemplate!: CdkPortal;

  @Output()
  search = new EventEmitter<string>();
  @Output()
  changes = new EventEmitter<any>();

  constructor(
    private overlay: Overlay,
    private origin: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['list'] && this.list)
      this.optionsList = [...this.list, ...this.newOptions];
  }

  show() {
    this.overlayRef = this.overlay.create(getOverlayConfig(this.overlay, this.origin));
    this.overlayRef.attach(this.contentTemplate);
    this.syncWidth();
    this.overlayRef.backdropClick().pipe(take(1)).subscribe(() => this.hide());
  }

  private syncWidth(): void {
    if (!this.overlayRef) {
      return;
    }
    const refRectWidth = this.origin.nativeElement.getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: refRectWidth });
  }

  private hide(): void {
    this.overlayRef.detach();
  }

  mapValues(value: any, options: any[]) {
    return options.find(o => o.value === value) ?? null;
  }

  filterNull(item: any) {
    return item !== null && item !== undefined;
  }

  filterOptions(option: any, value: any[], search: string) {
    if (value === option['value'])
      return false;

    if (search && !option['name'].toLowerCase().includes(search.toLowerCase()))
      return false;

    return true;
  }

  tryAddNewValue(e: any, value: string) {

    if (e.key === 'Enter') {
      this.addNewValue(value);

      e.preventDefault();
    }
  }

  addNewValue(value: string) {
    if (!value || !this.addNew)
      return;

    const newValue = { name: value, value: value };
    
    this.newOptions.push(newValue);
    this.optionsList = [newValue, ...this.optionsList];
    this.add(newValue.value);
  }

  add(val: any) {
    this.hide();

    if (!this.disabled) {
      this.touched || ((this.touched = true) || this.onTouched());
      this.value = val;
      this.searchControl.reset('', { emitEvent: false });
      this.onChange(this.value);
      this.changes.emit(this.value);
    }
  }

  remove() {
    if (!this.disabled) {
      this.touched || ((this.touched = true) || this.onTouched());
      this.value = null;
      this.onChange(this.value);
      this.changes.emit(this.value);
    }
  }

  getValueName(val: any, options: any[]) {
    return options.find(o => o.value === val)?.name ?? '';
  }


  // ControlValueAccessor
  // -----------------------------------------------------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(item: any) {
    this.value = item ?? null;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    disabled ? this.searchControl.disable() : this.searchControl.enable()
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return null;
  }
}
