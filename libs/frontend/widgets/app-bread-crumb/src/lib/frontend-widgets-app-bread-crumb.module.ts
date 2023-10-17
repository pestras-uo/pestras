import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbWidgetComponent } from './bread-crumb-widget/bread-crumb-widget';
import { BreadcrumbModule } from '@pestras/frontend/ui';

@NgModule({
  declarations: [BreadCrumbWidgetComponent],
  imports: [CommonModule, BreadcrumbModule],
  exports: [BreadCrumbWidgetComponent]
})
export class AppBreadCrumbModule {}
