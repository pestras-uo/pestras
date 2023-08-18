/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, forwardRef, Input, ViewChild, Output, EventEmitter, OnInit, OnDestroy, HostListener, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { PuiFileInputError, PuiFileInput, PuiFileSize } from '../file-input/file-input.component';
import { Subscription } from 'rxjs';
import { PuiIcon } from '../icon/icon.directive';
import { fileToDataUrl, resizeImageFIle } from './util';

export { PuiFileInputError };

@Component({
  selector: 'pui-image-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PuiFileInput, PuiIcon],
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => PuiImageInput) },
    { provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => PuiImageInput) }
  ]
})
export class PuiImageInput implements OnInit, OnDestroy, ControlValueAccessor {

  private sub!: Subscription
  readonly imageControl = new FormControl<File[] | null>(null);

  passedFiles: File[] = [];
  invalidMsgs: PuiFileInputError[] = [];
  disabled = false;
  touched = false;
  paths: string[] = [];
  message = '';

  @ViewChild('input')
  input!: PuiFileInput;

  @Input()
  labelRef = '';
  @Input()
  max = 1;
  @Input()
  placeholder?: string;
  @Input()
  maxSize: PuiFileSize | null = null;
  @Input()
  accept = '';
  @Input()
  newWidth = 0;
  @Input()
  newHeight = 0;

  @HostBinding('class.droping')
  droping = false;

  @HostListener('dragover', ['$event'])
  dragover(e: Event) {
    e.preventDefault();
    this.droping = true;
  }

  @HostListener('dragleave', ['$event'])
  dragout(e: Event) {
    e.preventDefault();
    this.droping = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(ev: DragEvent) {
    ev.preventDefault();

    const files: File[] = [];

    if (ev.dataTransfer?.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        const item = ev.dataTransfer.items[i];
        if (item.kind === "file") {
          const file = item.getAsFile();
          file && files.push(file);
        }
      }
    }

    const passed = this.filterByAccept(files);

    if (passed.length > 0)
      this.input.filesChange(this.passedFiles.concat(passed));

    this.droping = false;
  }

  @Output()
  invalidList = new EventEmitter<PuiFileInputError[]>();

  ngOnInit(): void {
    this.message = this.placeholder || (this.max ? 'Choose Images' : 'Chooe Image');

    this.sub = this.imageControl.valueChanges
      .subscribe(files => {
        this.fileChanges(files)
      });
  }

  ngOnDestroy(): void {
    !!this.sub && this.sub.unsubscribe();
  }

  reset() {
    this.passedFiles = [];
    this.paths = [];
    this.input.reset();
    this.onChange(null);
  }

  async fileChanges(files: File[] | null) {
    this.touched || ((this.touched = true) || this.onTouched());

    if (!files || files.length === 0) {
      this.reset();
      this.invalidList.emit(this.invalidMsgs);
      return;
    }

    const passedFiles: File[] = [];

    if (this.newWidth || this.newHeight) {

      for (let i = 0; i < files.length; i++)
        passedFiles.push(await resizeImageFIle(files[i], this.newWidth ?? this.newHeight, !this.newWidth));

    } else {
      passedFiles.push(...files);
    }

    this.passedFiles = passedFiles;
    this.invalidList.emit(this.invalidMsgs);

    if (passedFiles.length > 0) {
      this.displayImages(passedFiles);
      this.input.total = passedFiles.length;
      this.onChange(this.max > 1 ? passedFiles : passedFiles[0] ?? null);

    } else
      this.reset();
  }

  removeImage(index: number) {
    if (!this.passedFiles.length)
      return;

    const newValue = this.passedFiles.filter((_, i) => i !== index)

    if (newValue.length === 0)
      this.input.clear();
    else {
      this.paths = this.paths.filter((_, i) => i !== index);
      this.onChange(this.max > 1 ? newValue : newValue[0] ?? null);
    }
  }

  filterByAccept(files: File[]) {
    if (!this.accept)
      return files;

    const exts = this.accept.split(',');

    return files.filter(file => exts.some(ext => file.name.endsWith(ext.trim())))
  }

  onInvalid(data: PuiFileInputError[]) {
    this.invalidMsgs = data;
  }

  async displayImages(files: File[]) {
    const paths: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        paths.push(await fileToDataUrl(files[i]));
      } catch (error: any) {
        console.warn('error loading image:', error?.message);
      }
    }

    this.paths = paths;
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

