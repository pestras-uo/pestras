/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DataStore, DataStoreType, SubDataStores } from '@pestras/shared/data-model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.view.html',
  styleUrls: ['./side-menu.view.scss']
})
export class SideMenuView implements OnChanges {

  subDataStores!: SubDataStores[];
  isTable!: boolean;

  @Input({ required: true })
  view!: { name: string; payload?: any; };
  @Input()
  topic: string | null = null;
  @Input({ required: true })
  dataStore!: DataStore;

  @Output()
  selects = new EventEmitter<{ name: string; payload?: any; }>();

  constructor(protected loc: Location) {}

  ngOnChanges(): void {
    this.isTable = this.dataStore.type === DataStoreType.TABLE;
    this.subDataStores = this.dataStore.settings.sub_data_stores;
  }
}
