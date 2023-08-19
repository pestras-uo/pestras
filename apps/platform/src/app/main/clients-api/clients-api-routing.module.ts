import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsApiPage } from './clients-api.page';
import { BlueprintResolver } from '@pestras/frontend/state';

const routes: Routes = [{ path: ':blueprint/:serial', component: ClientsApiPage, resolve: { blueprint: BlueprintResolver } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsApiRoutingModule { }
