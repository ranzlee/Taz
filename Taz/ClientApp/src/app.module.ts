import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

// features
import { FakeEntityModule } from './app/features/fake-entity/fake-entity.module';

// routing
import { AppRoutingModule } from './app-routing.module';

// components
import { AppComponent } from './app/components/app/app.component';
import { NavMenuComponent } from './app/components/nav-menu/nav-menu.component';
import { HomeComponent } from './app/components/home/home.component';
import { FetchDataComponent } from './app/components/fetch-data/fetch-data.component';
import { LoginComponent } from './app/components/account/login/login.component';
import { NotAuthorizedComponent } from './app/components/not-authorized/not-authorized.component';

// services
import { EnvironmentService } from './app/services/environment/environment.service';
import { HttpService } from './app/services/http/http.service';
import { TokenService } from './app/services/security/token-service';
import { RouteGuard } from './app/services/security/route-guard';
import { SecurityService } from './app/services/security/security-service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
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
    AppRoutingModule
  ],
  providers: [
    EnvironmentService,
    HttpService,
    SecurityService,
    RouteGuard,
    TokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
