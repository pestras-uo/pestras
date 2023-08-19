import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlueprintsRouter } from './blueprints.router';
import { MainPage } from './main/main.page';
import { DetailsPage } from './details/details.page';

const routes: Routes = [{
  path: '', component: BlueprintsRouter, children: [
    { path: '', component: MainPage },
    { path: ':serial', component: DetailsPage },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlueprintsRoutingModule { }
