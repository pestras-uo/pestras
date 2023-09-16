/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStore, Field } from '@pestras/shared/data-model';
import { PuiIcon } from '@pestras/frontend/ui';
import { RouterModule } from '@angular/router';
import { ContraModule } from '@pestras/frontend/util/contra';

@Component({
  selector: 'tree-view-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, ContraModule, PuiIcon],
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

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  data!: Record<string, any>[];
  @Input({ required: true })
  levels!: { field: string, display_field: string | null }[];
  @Input()
  index = 0;
  @Input()
  baseUrl?: string;
  @Input()
  filter?: { field: string, value: any };

  ngOnInit(): void {
    this.isLast = this.index === this.levels.length;

    const level = this.levels[this.index];
    const displayField = this.isLast
      ? this.dataStore.fields.find(f => f.name === this.dataStore.settings.interface_field)
      : this.dataStore.fields.find(f => f.name === level.display_field || f.name === level.field);

    if (!displayField) {
      this.list = [];
      return
    }

    if (!this.isLast) {
      const list: any = [];
      const groups = this.data
        // filter by ibput filter if exists
        .filter(r => this.filter ? r[this.filter.field] === this.filter.value : true)
        // group by current level value
        .reduce((map: Map<string, any>, r) => {
          const key = r[level.field];

          if (map.has(key))
            return map;

          map.set(key, { fieldName: level.field, displayFieldValue: r[displayField.name], serial: r['serial'] });

          return map;
        }, new Map<string, any>());

      for (const [key, data] of groups.entries())
        list.push({
          value: key,
          fieldName: data.fieldName,
          displayField,
          displayFieldValue: data.displayFieldValue,
          serial: data.serial
        });

      this.list = list;

    } else {
      this.list = this.data
        .filter(r => this.filter ? r[this.filter.field] === this.filter.value : true)
        .map(r => {
          return {
            value: r[displayField.name],
            fieldName: displayField.name,
            displayField: displayField,
            displayFieldValue: r[displayField.name],
            serial: r['serial']
          };
        });
    }
  }
}
