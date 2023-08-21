/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, TemplateRef } from '@angular/core';
import { Category } from '@pestras/shared/data-model';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.view.html'
})
export class CategoryDetailsView {

  private dialogRef: DialogRef | null = null;

  readonly search = new FormControl<string>('', { nonNullable: true });
  readonly page$ = new BehaviorSubject<number>(1);

  count = 0;
  skip = 0;
  pageSize = 10;

  @Input({ required: true })
  bp!: string;
  @Input({ required: true })
  selected!: Category;
  @Input()
  editable = false;

  constructor(
    private readonly dialog: Dialog
  ) { }

  openDialog(ref: TemplateRef<any>, data?: any) {
    this.dialogRef = this.dialog.open(ref, { data });
  }

  closeDialog() {
    if (this, this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  filterBranches = (row: Category, search: string) => {
    return search ? row.title.includes(search) : true
  }

  sliceBranches = (branches: Category[], page: number) => {
    this.count = branches.length;
    this.skip = (page - 1) * this.pageSize
    return branches.slice(this.skip, this.skip + this.pageSize);
  }
}
