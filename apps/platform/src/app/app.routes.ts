import { Route } from '@angular/router';
import { SigninPage } from './signin/signin.page';
import { MainPage } from './main/main.page';
import { sessionGuard } from '@pestras/frontend/state';

export const appRoutes: Route[] = [
  { path: 'signin', component: SigninPage, canActivate: [sessionGuard('signin')] },
  {
    path: 'main', component: MainPage, canActivate: [sessionGuard('main')], children: [
      { path: 'workspace', loadChildren: () => import('./main/workspace/workspace.module').then(m => m.WorkspaceModule) }
      // // administration
      // { path: 'orgunits', loadChildren: () => import('./orgunits/orgunits.module').then(m => m.OrgunitsModule) },
      // { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
      // { path: 'regions', loadChildren: () => import('./regions/regions.module').then(m => m.RegionsModule) },
      // { path: 'groups', loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule) },
      // // blueprints
      // { path: 'blueprints', loadChildren: () => import('./blueprints/blueprints.module').then(m => m.BlueprintsModule) },
      // { path: 'data-stores', loadChildren: () => import('./data-stores/data-stores.module').then(m => m.DataStoresModule) },
      // // export
      // { path: 'clients-api', loadChildren: () => import('./clients-api/clients-api.module').then(m => m.ClientsApiModule) },
      // // data and reporting
      // { path: 'topics', loadChildren: () => import('./topics/topics.module').then(m => m.TopicsModule) },
      // { path: 'records', loadChildren: () => import('./records/records.module').then(m => m.RecordsModule) },
      // { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
      // { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
      // // user
      // { path: 'profile', component: ProfilePage }
    ]
  },
  { path: '', redirectTo: "signin", pathMatch: "full" }
];
