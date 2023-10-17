// eslint-disable-next-line @typescript-eslint/no-empty-function

import { Component, Input } from '@angular/core';
import { IBreadCrumb } from './breadcrumb.interface';

export { IBreadCrumb };

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input()
  breadcrumbs: IBreadCrumb[] = []; // Make sure 'any[]' is the correct type for your breadcrumbs data.

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

 
}
