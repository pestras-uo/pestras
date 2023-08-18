/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Category } from '@pestras/shared/data-model';
import { ContraService } from '@pestras/frontend/util/contra';
import { PuiTableColumnType, PuiTableConfig } from '@pestras/frontend/ui';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.view.html'
})
export class CategoryDetailsView implements OnInit {

  private dialogRef: DialogRef | null = null;

  tableConfig!: PuiTableConfig<Category>;

  @Input({ required: true })
  bp!: string;
  @Input({ required: true })
  selected!: Category;
  @Input()
  editable = false;

  constructor(
    private readonly contra: ContraService,
    private readonly dialog: Dialog
  ) { }

  ngOnInit(): void {

    const c = this.contra.content();

    this.tableConfig = {
      indexing: true,
      pagination: 10,
      search: true,
      sort: ['title'],
      columns: [
        { key: 'title', header: c['title'] },
        { key: 'ordinal', header: c['ordinal'], type: PuiTableColumnType.BOOL }
      ]
    };

    if (this.selected.ordinal)
      this.tableConfig.columns.push({ key: 'value', header: c['value'] });


    if (this.editable)
      this.tableConfig.columns.push({ key: 'edit', header: c['edit'], icon: 'edit', type: PuiTableColumnType.ACTION });
  }

  openDialog(ref: TemplateRef<any>, data?: any) {
    this.dialogRef = this.dialog.open(ref, { data });
  }

  closeDialog() {
    if (this, this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
