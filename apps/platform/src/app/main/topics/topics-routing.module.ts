import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicsRouterComponent } from './topics.router';
import { DetailsPage } from './details/details.page';
import { MainPage } from './main/main.page';

const routes: Routes = [
  {
    path: '',
    component: TopicsRouterComponent,
   
    children: [
      {
        path: '',

        component: MainPage,
      },
      {
        path: ':serial',

        component: DetailsPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicsRoutingModule {}
