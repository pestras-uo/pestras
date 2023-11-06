/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { DataStore, DataStoreType } from '@pestras/shared/data-model';

@Component({
  selector: 'app-data-stores-list-menu',
  templateUrl: './data-stores-list.view.html',
  styles: [`
      :host {
        display: block;
      }
    `],
})
export class DataStoresListView {
  types = DataStoreType;
  active: DataStore | null = null;
  tab = 'data';

  @Input({ required: true })
  blueprint!: string;
  @Input({ required: true })
  topic!: string;

  setDefaultActive = (dataStores: DataStore[]) => {
    if (!this.active && dataStores?.length > 0) this.active = dataStores[0];

    return dataStores;
  };
  showDropdown = false; // Variable to track dropdown visibility

  toggleDropdown() {
    this.showDropdown = !this.showDropdown; // Toggle dropdown visibility
  }
}
