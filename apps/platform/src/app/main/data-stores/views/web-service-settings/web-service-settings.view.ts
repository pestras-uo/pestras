/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { DataStore } from '@pestras/shared/data-model';

@Component({
  selector: 'app-web-service-settings',
  templateUrl: './web-service-settings.view.html',
  styles: [
  ]
})
export class WebServiceSettingsView {

  tab = 1

  @Input({ required: true })
  dataStore!: DataStore;
  @Input()
  editable = false;
}
