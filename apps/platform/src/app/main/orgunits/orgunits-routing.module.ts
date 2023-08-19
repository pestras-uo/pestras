import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgunitsPage } from './orgunits.page';

const routes: Routes = [
  { path: '', component: OrgunitsPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgunitsRoutingModule { }
