import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardsRouterComponent } from './dashboards.router';
import { DetailsPageComponent } from './details/details.page';
import { MainPageComponent } from './main/main.page';

const routes: Routes = [{
  path: '', component: DashboardsRouterComponent, children: [
    { path: '', component: MainPageComponent },
    { path: ':serial', component: DetailsPageComponent },
    { path: ':topic/:serial', component: DetailsPageComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
