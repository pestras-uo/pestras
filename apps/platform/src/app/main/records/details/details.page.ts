/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges } from '@angular/core';
import { RecordsEntitiesState } from '@pestras/frontend/state';
import { DataStore, Field, TableDataRecord } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styles: [`
    :host {
      height: var(--main-height);
      display: grid;
      grid-template-columns: auto 1fr;
    }

    main {
      height: 100%;
      overflow-y: auto;
    }
  `]
})
export class DetailsPage implements OnChanges {

  view: { name: string; payload?: any } = { name: 'details', payload: null };
  dataStore$!: Observable<DataStore | null>;
  record$!: Observable<TableDataRecord | null>;
  mainField: Field | null = null;

  @Input()
  topic?: string;
  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  record!: string;

  constructor(private state: RecordsEntitiesState) { }

  ngOnChanges() {
    this.mainField = this.dataStore.fields.find(f => f.name === this.dataStore.settings.interface_field) ?? null;

    this.record$ = this.state.select(this.record, this.dataStore.serial) as Observable<TableDataRecord | null>;
  }
}