import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FakeEntityListComponent } from './fake-entity-list/fake-entity-list.component';
import { RouteGuard } from '../../services/security/route-guard';

const fakeEntityRoutes: Routes = [
  // {
  //   path: 'fake-entity-list',
  //   component: FakeEntityListComponent,
  //   canActivate: [RouteGuard],
  //   data: {
  //     authorizedPolicies: [Taz.Model.Security.PolicyTypeEnum.Administrator]
  //   }
  // }
  {
    path: '',
    component: FakeEntityListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(fakeEntityRoutes)],
  exports: [RouterModule]
})
export class FakeEntityRoutingModule {}
