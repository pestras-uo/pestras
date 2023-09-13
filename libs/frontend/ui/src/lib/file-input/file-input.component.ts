/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';

export type PuiFileSizeUnit = 'GB' | 'MB' | 'KB' | 'Byte';

export type PuiFileSize = `${number} ${PuiFileSizeUnit}`;

export interface PuiFileInputError {
  msg: string;
  file: string;
  limit: string | number;
  input: string | number;
}

const unitValueMap: Record<PuiFileSizeUnit, number> = {
  Byte: 1,
  KB: 1024,
  MB: 1_048_576,
  GB: 1_073_741_824
};

@Component({
  selector: 'pui-file-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => PuiFileInput) },
    { provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => PuiFileInput) }
  ]
})
export class PuiFileInput implements OnInit {
  private _limit: number | null = null;

  passedFiles: File[] = [];
  disabled = false;
  touched = false;
  message!: string;
  size = 0;
  total = 0;
  unit: 'GB' | 'MB' | 'KB' | 'Byte' | null = null;

  @ViewChild('input')
  input!: ElementRef;


  @Input()
  labelRef = '';
  @Input()
  max = 1;
  @Input()
  placeholder?: string;;
  @Input()
  maxSize: PuiFileSize | null = null;
  @Input()
  accept = '';

  @Output()
  invalidList = new EventEmitter<PuiFileInputError[]>();

  @HostListener('click')
  onClick() {
    this.open();
  }

  ngOnInit(): void {
    this.message = this.placeholder || 'Choose File';

    if (this.maxSize) {
      const [size, unit] = this.maxSize.split(' ') as [string, PuiFileSizeUnit];

      this._limit = +size * unitValueMap[unit];
    }
  }

  open() {
    if (this.input) {
      const el: HTMLInputElement = this.input.nativeElement;
      el.click();
    }
  }

  clear() {
    this.input.nativeElement.value = '';
    this.filesChange(null);
  }

  reset() {
    this.passedFiles = [];
    this.message = this.placeholder || 'Choose File';
    this.size = 0;
    this.unit = null;
    this.total = 0;
    this.onChange([]);
    return;
  }

  filesChange(files: FileList | File[] | null) {
    
    this.touched || ((this.touched = true) || this.onTouched());
    const invalidMsgs: PuiFileInputError[] = [];

    if (!files || files.length === 0) {
      this.invalidList.emit([]);
      return this.reset();
    }

    const passedFiles: File[] = [];

    if (files.length > this.max)
      invalidMsgs.push({ msg: 'countExceed', file: '', limit: this.max, input: files.length });

    for (let i = 0; i < Math.min(files.length, this.max); i++) {
      const file = files[i];
      const sizeData = this.toSizeUnit(file.size);

      if (this._limit && this._limit < sizeData.size * unitValueMap[sizeData.unit]) {
        console.warn('invalid file size');
        invalidMsgs.push({ 
          msg: 'invalidSize', 
          file: file.name,
          limit: this.sizeToString(this._limit), 
          input: this.sizeToString(file.size) 
        });

        if (this.max)
          continue;
        else
          break;

      } else if (passedFiles.length === 0) {
        this.size = sizeData.size;
        this.unit = sizeData.unit;
        this.message = file.name;
      }

      passedFiles.push(file);
    }

    this.invalidList.emit(invalidMsgs);
    this.passedFiles = passedFiles;

    if (this.passedFiles.length > 0) {
      this.total = passedFiles.length;
      this.onChange(this.max === 1 ? this.passedFiles[0] : this.passedFiles);

    } else
      this.reset();
  }

  checkSize(sizeData: { size: number; unit: "GB" | "MB" | "KB" | "Byte"; }) {
    const size = sizeData.size * unitValueMap[sizeData.unit];

    return this._limit && this._limit < size ? false : size;
  }

  toSizeUnit(size: number): { size: number; unit: 'GB' | 'MB' | 'KB' | 'Byte' } {
    if (size > 1_073_741_824) return { size: +(size / 1_073_741_824).toFixed(3), unit: 'GB' };
    if (size > 1_048_576) return { size: +(size / 1_048_576).toFixed(3), unit: 'MB' };
    if (size > 1_024) return { size: +(size / 1024).toFixed(3), unit: 'KB' };
    return { size, unit: 'Byte' };
  }

  sizeToString(size: number) {
    const sizeData = this.toSizeUnit(size);
    return `${sizeData.size} ${sizeData.unit}`;
  }

  // ControlValueAccessor
  // --------------------------------------------------------------------
  private onChange = (_: any) => {
    //
  };
  private onTouched = () => {
    //
  };

  writeValue() {
    //
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return null;
  }
}
