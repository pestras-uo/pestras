import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsApiPage } from './clients-api.page';
import { BlueprintResolver } from '../../../state/blueprints/blueprints.resolver';

const routes: Routes = [{ path: ':blueprint/:serial', component: ClientsApiPage, resolve: { blueprint: BlueprintResolver } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsApiRoutingModule { }
