/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataStore } from '@pestras/shared/data-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.view.html',
  styleUrls: ['./side-menu.view.scss']
})
export class DetailsSideMenuView {
  subDataStores$!: Observable<DataStore[]>;

  @Input({ required: true })
  dataStore!: DataStore;
  @Input({ required: true })
  view!: string;

  @Output()
  selects = new EventEmitter<string>();

  constructor(
    protected loc: Location
  ) { }
}
