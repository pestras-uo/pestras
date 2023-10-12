import { Component, Input, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input()
  breadcrumbs: any[] = []; // Make sure 'any[]' is the correct type for your breadcrumbs data.

  static breadCrumbContent: any = [{}];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static breadCrumbFunc(
    label: string,
    name: string,
    serial: string,
    link: string,
    queryParams: { [key: string]: any }
  ) {
    this.breadCrumbContent = [
      {
        //label: c['topics'],
        label: label,
        link: link,

        queryParams: queryParams,
      },
      {
        // label: topic.name,
        label: name,
        link: `/${serial}`,
        queryParams: queryParams,
      },
    ];

    return this.breadCrumbContent;
  }
}
