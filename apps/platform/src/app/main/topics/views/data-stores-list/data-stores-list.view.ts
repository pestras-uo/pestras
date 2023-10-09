/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { DataStore, DataStoreType } from '@pestras/shared/data-model';

@Component({
  selector: 'app-data-stores-list-menu',
  templateUrl: './data-stores-list.view.html',
  styles: [
    `
      :host {
        display: block;
      }

      .card {
        margin-bottom: 16px;
      }

      main {
        display: block;

        width: 100%;
      }
      button {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start !important;
        padding: 6px 6px;
      }
    `,
  ],
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
