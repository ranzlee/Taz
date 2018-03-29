import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { HomeComponent } from './app/components/home/home.component';
import { LoginComponent } from './app/components/account/login/login.component';
import { FetchDataComponent } from './app/components/fetch-data/fetch-data.component';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';

// services
import { RouteGuard } from './app/services/security/route-guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'fetch-data',
    component: FetchDataComponent,
    canActivate: [RouteGuard],
    data: {
      authorizedPolicies: [Taz.Model.Security.PolicyTypeEnum.AuthenticatedUser]
    }
  },
  {
    path: 'fake-entity-list',
    loadChildren:
      'app/features/fake-entity/fake-entity.module#FakeEntityModule',
    canLoad: [RouteGuard],
    data: {
      authorizedPolicies: [Taz.Model.Security.PolicyTypeEnum.Administrator]
    }
  },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
