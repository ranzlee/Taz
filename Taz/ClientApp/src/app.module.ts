import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// components
import { AppComponent } from './app/components/app/app.component';
import { NavMenuComponent } from './app/components/nav-menu/nav-menu.component';
import { HomeComponent } from './app/components/home/home.component';
import { CounterComponent } from './app/components/counter/counter.component';
import { FetchDataComponent } from './app/components/fetch-data/fetch-data.component';
import { FakeEntityListComponent } from './app/components/fake-entity/fake-entity-list/fake-entity-list.component';
import { FakeEntityGroupComponent } from './app/components/fake-entity/fake-entity-group/fake-entity-group.component';
import { FakeEntityDetailComponent } from './app/components/fake-entity/fake-entity-detail/fake-entity-detail.component';
import { LoginComponent } from './app/components/account/login/login.component';

// services
import { EnvironmentService } from './app/services/environment/environment.service';
import { HttpService } from './app/services/http/http.service';

// stores
import { FakeEntityStoreService } from './app/stores/fake-entity-store/fake-entity-store.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    FakeEntityListComponent,
    FakeEntityGroupComponent,
    FakeEntityDetailComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'fake-entity-list', component: FakeEntityListComponent },
      { path: 'login', component: LoginComponent }
    ])
  ],
  providers: [EnvironmentService, HttpService, FakeEntityStoreService],
  bootstrap: [AppComponent]
})
export class AppModule {}
