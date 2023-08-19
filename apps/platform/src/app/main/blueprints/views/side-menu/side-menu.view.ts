/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Blueprint } from '@pestras/shared/data-model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.view.html',
  styleUrls: ['./side-menu.view.scss']
})
export class SideMenuView {

  @Input({ required: true })
  blueprint!: Blueprint;
  @Input({ required: true })
  view!: string;

  @Output()
  selects = new EventEmitter<string>();

  constructor(protected loc: Location) {}
}
