import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsPage } from './groups.page';

const routes: Routes = [{ path: '', component: GroupsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
