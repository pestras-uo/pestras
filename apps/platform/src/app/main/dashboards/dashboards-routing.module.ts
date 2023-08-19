import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardsRouter } from './dashboards.router';
import { DetailsPage } from './details/details.page';

const routes: Routes = [{
  path: '', component: DashboardsRouter, children: [
    { path: ':topic/:serial', component: DetailsPage },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
