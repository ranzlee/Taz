import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// routing
import { FakeEntityRoutingModule } from './fake-entity-routing.module';

// components
import { FakeEntityListComponent } from './fake-entity-list/fake-entity-list.component';
import { FakeEntityGroupComponent } from './fake-entity-group/fake-entity-group.component';
import { FakeEntityDetailComponent } from './fake-entity-detail/fake-entity-detail.component';

// stores
import { FakeEntityStoreService } from './fake-entity-store.service';

@NgModule({
  declarations: [
    FakeEntityListComponent,
    FakeEntityGroupComponent,
    FakeEntityDetailComponent
  ],
  imports: [CommonModule, FormsModule, FakeEntityRoutingModule],
  providers: [FakeEntityStoreService]
})
export class FakeEntityModule {}
