import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [RouterModule, CommonModule],
  exports: [BreadcrumbComponent],
})
export class BreadcrumbModule {}
