import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

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

// authentication
import { AuthenticationGuard } from './app/authentication/authentication-guard-service';
import { AuthenticationService } from './app/authentication/authentication-service';

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
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        whitelistedDomains: ['localhost']
      }
    }),
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: 'counter',
        component: CounterComponent,
        canActivate: [AuthenticationGuard]
      },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'fake-entity-list', component: FakeEntityListComponent },
      { path: 'login', component: LoginComponent }
    ])
  ],
  providers: [
    EnvironmentService,
    HttpService,
    AuthenticationService,
    AuthenticationGuard,
    FakeEntityStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
