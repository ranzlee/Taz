import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// components
import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { CounterComponent } from '../components/counter/counter.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
import { LoginComponent } from '../components/account/login/login.component';

// services
import { EnvironmentService } from '../services/environment/environment.service';
import { HttpService } from '../services/http/http.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
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
      { path: 'login', component: LoginComponent }
    ])
  ],
  providers: [EnvironmentService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {}
