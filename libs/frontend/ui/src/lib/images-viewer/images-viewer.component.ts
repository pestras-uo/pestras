/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Dialog, DialogRef} from '@angular/cdk/dialog';
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

@Component({
  selector: 'pui-images-viewer',
  templateUrl: './images-viewer.component.html',
  styleUrls: ['./images-viewer.component.scss']
})
export class PuiImagesViewer {

  selected = 0;
  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  images: { src: string; id: any; title: string }[] = [];
  @Input()
  canRemove = false;
  @Input()
  host = '';

  @Output()
  remove = new EventEmitter<string>();

  constructor(private dialog: Dialog) {}

  enlarge(tmp: TemplateRef<any>, index: number) {
    this.selected = index;
    this.dialogRef = this.dialog.open(tmp, { disableClose: true });
  }

  closeEnlarge() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
      this.selected = 0;
    }
  }

  next() {
    this.selected = this.selected === this.images.length - 1
      ? 0 : this.selected + 1;
  }

  prev() {
    this.selected = this.selected === 0
      ? this.images.length - 1 : this.selected - 1;
  }
}
