import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

// components
import { AppComponent } from './app/components/app/app.component';
import { NavMenuComponent } from './app/components/nav-menu/nav-menu.component';
import { HomeComponent } from './app/components/home/home.component';
import { FetchDataComponent } from './app/components/fetch-data/fetch-data.component';
import { FakeEntityListComponent } from './app/components/fake-entity/fake-entity-list/fake-entity-list.component';
import { FakeEntityGroupComponent } from './app/components/fake-entity/fake-entity-group/fake-entity-group.component';
import { FakeEntityDetailComponent } from './app/components/fake-entity/fake-entity-detail/fake-entity-detail.component';
import { LoginComponent } from './app/components/account/login/login.component';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';

// services
import { EnvironmentService } from './app/services/environment/environment.service';
import { HttpService } from './app/services/http/http.service';
import { TokenService } from './app/services/authentication/token-service';
import { AuthenticationGuard } from './app/services/authentication/authentication-guard-service';
import { AuthenticationService } from './app/services/authentication/authentication-service';

// stores
import { FakeEntityStoreService } from './app/stores/fake-entity-store/fake-entity-store.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
    FakeEntityListComponent,
    FakeEntityGroupComponent,
    FakeEntityDetailComponent,
    LoginComponent,
    NotAuthorizedComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useClass: TokenService
      }
    }),
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'not-authorized', component: NotAuthorizedComponent },
      {
        path: 'fetch-data',
        component: FetchDataComponent,
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'fake-entity-list',
        component: FakeEntityListComponent,
        canActivate: [AuthenticationGuard]
      }
    ])
  ],
  providers: [
    EnvironmentService,
    HttpService,
    AuthenticationService,
    AuthenticationGuard,
    TokenService,
    FakeEntityStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
