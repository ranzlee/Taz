import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { FakeEntityListComponent } from './fake-entity-list/fake-entity-list.component';

// services
import { RouteGuard } from '../../services/security/route-guard';

const fakeEntityRoutes: Routes = [
  {
    path: '',
    component: FakeEntityListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(fakeEntityRoutes)],
  exports: [RouterModule]
})
export class FakeEntityRoutingModule { }
