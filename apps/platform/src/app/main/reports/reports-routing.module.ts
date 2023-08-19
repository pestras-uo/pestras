import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsRouter } from './reports.router';
import { DetailsPage } from './details/details.page';

const routes: Routes = [{
  path: '', component: ReportsRouter, children: [
    { path: ':topic/:serial', component: DetailsPage },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
