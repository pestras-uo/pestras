/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnChanges, Output, TemplateRef, OnInit } from '@angular/core';
import { Orgunit } from '@pestras/shared/data-model';
import { ContraService } from '@pestras/frontend/util/contra';
import { PuiTableColumnType, PuiTableConfig } from '@pestras/frontend/ui';
import { OrgunitsState } from '@pestras/frontend/state';
import { Observable, map } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Serial } from '@pestras/shared/util'

@Component({
  selector: 'app-orgunit-details',
  templateUrl: './orgunit-details.view.html',
  styleUrls: ['./orgunit-details.view.scss']
})
export class OrgunitDetailsView implements OnChanges, OnInit {
  orgunit$!: Observable<Orgunit | null>;
  branches$!: Observable<Orgunit[]>;
  tableConfig!: PuiTableConfig<Orgunit>;

  dialogRef: DialogRef | null = null;

  @Input({ required: true })
  serial!: string;

  @Output()
  add = new EventEmitter<string>();
  @Output()
  selects = new EventEmitter<string>();

  constructor(
    private readonly state: OrgunitsState,
    private readonly contra: ContraService,
    private readonly dialog: Dialog
  ) { }

  ngOnInit(): void {

    const c = this.contra.content();

    this.tableConfig = {
      rowPointer: true,
      indexing: true,
      search: true,
      sort: ['name'],
      columns: [
        { key: 'name', header: c['name'], type: PuiTableColumnType.TEMPLATE, searchable: true },
        { key: 'class', header: c['class'] },
        { key: 'last_modified', header: c['lastModified'], type: PuiTableColumnType.DATE, cssClass: 'bold' }
      ],
      pagination: 4
    }
  }

  ngOnChanges(): void {
    this.orgunit$ = this.state.select(this.serial);

    this.branches$ = this.state.selectMany(o => Serial.isChild(this.serial, o.serial, 1))
      .pipe(map(list => list.sort((a, b) => {
        const diff = Serial.countLevels(a.serial) - Serial.countLevels(b.serial);

        return diff !== 0
          ? diff
          : a.name < b.name ? -1 : 1
      })));
  }

  openModal(ref: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(ref);
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
