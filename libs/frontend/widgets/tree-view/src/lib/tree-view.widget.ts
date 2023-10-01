
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRecord, DataStore, Field } from '@pestras/shared/data-model';
import { PuiIcon } from '@pestras/frontend/ui';
import { RouterModule } from '@angular/router';
import { ContraModule } from '@pestras/frontend/util/contra';
import { Observable } from 'rxjs';

@Component({
  selector: 'tree-view-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, ContraModule, PuiIcon],
  styleUrls: ['./tree-view.widget.scss'],

  templateUrl: './tree-view.widget.html',
  styles: [`
    fieldset {
      margin-block-end: 16px;

      :is(legend) {
        padding-inline: 4px;
        gap: 4px;
      }
    }

    .fieldset-closed {
      border-style: none;
      margin-block: 0;
      padding-block: 4px;
    }
  `]
})
export class TreeViewWidget implements OnInit {

  isLast!: boolean;
  list!: { value: any, fieldName: string, displayField: Field, displayFieldValue: any, serial?: string }[];

  categories$!: Observable<string[]>;
  data$!: Observable<DataRecord[]>;

  loadedNodes: Record<string, any>[] = [];
  hidden: boolean[] = [];

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  levels!: { field: string, display_field: string | null }[];
  @Input()
  level = 0;
  @Input()
  filter!: Record<string, any>;
  @Input({ required: true })
  loadCategory!: (category: string, parents: Record<string, string>) => Observable<string[]>;
  @Input({ required: true })
  loadData!: (parents: Record<string, string>) => Observable<Record<string, any>[]>;
  @Input()
  clickHandler?: (item: DataRecord) => void;

  ngOnInit(): void {
    this.isLast = this.level === this.levels.length;
    const currentLevel = this.levels[this.level];

    if (!this.isLast) {

      this.categories$ = this.loadCategory(currentLevel.field, this.filter);

    } else {
      this.data$ = this.loadData(this.filter);
    }
  }

  toggleNode(index: number, value: string) {
    if (this.loadedNodes[index]) {
      this.hidden[index] = !this.hidden[index];
    } else {
      this.loadedNodes[index] = { [this.levels[this.level].field]: value };
      this.hidden[index] = !this.hidden[index];
    }
  }

  onClick(item: DataRecord) {
    this.clickHandler && this.clickHandler(item);
  }
}