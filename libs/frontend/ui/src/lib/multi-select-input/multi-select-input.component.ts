/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, SimpleChanges, OnChanges, OnInit, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { startWith, take, tap } from 'rxjs';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { PuiIcon } from '../icon/icon.directive';
import { OverlayModule, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { PortalModule, CdkPortal } from '@angular/cdk/portal';
import { getOverlayConfig } from './util';
import { PuiUtilPipesModule } from '../util-pipes/util-pipes.module';
import { untilDestroyed } from '../reactive';

export interface MultiSelectTrans {
  placeholder?: string;
  item?: string;
  items?: string;
  all?: string;
}

@Component({
  selector: 'pui-multi-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PuiIcon, PortalModule, OverlayModule, PuiUtilPipesModule],
  templateUrl: './multi-select-input.component.html',
  styleUrls: ['./multi-select-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: PuiMultiSelectInput },
    { provide: NG_VALIDATORS, multi: true, useExisting: PuiMultiSelectInput }
  ]
})
export class PuiMultiSelectInput implements OnChanges, OnInit, ControlValueAccessor {
  private overlayRef!: OverlayRef;
  private ud = untilDestroyed();

  id = `msi-${Math.ceil(Math.random() * 1000000)}`

  arrayCtrl = new FormArray<FormControl<boolean>>([]);
  allCtrl = new FormControl<boolean>(false, { nonNullable: true });

  newOptions: any[] = [];
  optionsList: any[] = [];
  value: any[] = [];
  disabled = false;
  touched = false;
  searchControl = new FormControl("", { nonNullable: true });
  translation: MultiSelectTrans = {
    placeholder: "",
    item: "item",
    items: "items",
    all: "All"
  };

  @HostListener('window:resize')
  public onWinResize(): void {
    this.syncWidth();
  }

  @Input({ required: true })
  list: any[] = [];
  @Input()
  labelRef: number | string = '';
  @Input({ transform: booleanAttribute })
  addNew = false;
  @Input({ transform: booleanAttribute })
  badges = false;
  @Input()
  placeholder = '';
  @Input()
  set trans(value: MultiSelectTrans) {
    Object.assign(this.translation, value);
  }

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
    if (changes['list'] && this.list) {
      this.optionsList = [...this.list, ...this.newOptions];
      const checked = this.optionsList?.map(v => this.value.includes(v.value));
      this.arrayCtrl.reset();
      checked
        .forEach(c => this.arrayCtrl.push(new FormControl(c, { nonNullable: true }), { emitEvent: false }));
    }
  }

  ngOnInit(): void {
    this.arrayCtrl.valueChanges
      .pipe(
        this.ud(),
        startWith(this.arrayCtrl.value),
      )
      .subscribe(bools => {
        this.value = this.optionsList.filter((_, i) => bools[i]).map(v => v.value);
        this.onChange(this.value);
        this.changes.emit(this.value);
        this.touched || ((this.touched = true) && this.onTouched());
      });

    this.allCtrl.valueChanges
      .pipe(this.ud())
      .subscribe(checked => {
        this.arrayCtrl.controls.forEach((c, i) => {
          c.setValue(checked, { emitEvent: i === this.arrayCtrl.length - 1 })
        });
      })
  }

  show() {
    this.overlayRef = this.overlay.create(getOverlayConfig(this.overlay, this.origin));
    this.overlayRef.attach(this.contentTemplate);
    this.syncWidth();
    this.overlayRef.backdropClick().pipe(take(1)).subscribe(() => this.hide());
  }

  private syncWidth(): void {
    if (!this.overlayRef)
      return;

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
    this.optionsList = [...this.optionsList, newValue];
    this.arrayCtrl.push(new FormControl(true, { nonNullable: true }));
    this.searchControl.reset();
  }

  removeValue(value: any) {
    const index = this.optionsList.findIndex(item => item.value === value);

    console.log(value, index);

    if (index > -1)
      this.arrayCtrl.at(index).setValue(false);

  }


  // ControlValueAccessor
  // -----------------------------------------------------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue(items: any[]) {
    this.value = items;
    const checked = this.optionsList?.map(v => this.value.includes(v.value));
    if (this.optionsList.length)
      this.arrayCtrl.controls
        .forEach((c, i) => c.setValue(checked[i], { emitEvent: false }));
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
