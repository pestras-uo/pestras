import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataStoresRouter } from './data-stores.router';
import { DataStoreDetailsPage } from './details/details.page';
import { BlueprintResolver } from '../../../state/blueprints/blueprints.resolver';

const routes: Routes = [{
  path: '', component: DataStoresRouter, children: [
    { path: ':blueprint/:serial', component: DataStoreDetailsPage, resolve: { blueprint: BlueprintResolver } }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataStoresRoutingModule { }
