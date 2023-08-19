/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { DataStoresState } from '@pestras/frontend/state';
import { DataStore, DataStoreType, Topic } from '@pestras/shared/data-model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-data-stores-list-menu',
  templateUrl: './data-stores-list.view.html',
  styleUrls: ['./data-stores-list.view.scss']
})
export class DataStoresListView implements OnChanges {

  datastores$!: Observable<DataStore[]>;
  selected!: string;

  @Input({ required: true })
  topic!: Topic;

  @Output()
  selects = new EventEmitter<DataStore>();

  constructor(private state: DataStoresState) { }

  ngOnChanges() {
    this.datastores$ = this.state.selectGroup(this.topic.blueprint)
      .pipe(
        map(dss => dss.filter(ds => ds.type === DataStoreType.TABLE && !ds.settings.static))
      );
  }

  selectDs(ds: DataStore) {
    this.selected = ds.serial;
    this.selects.emit(ds);
  }
}
