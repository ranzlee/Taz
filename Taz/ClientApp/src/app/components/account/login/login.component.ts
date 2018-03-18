import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import { AuthenticationService } from '../../../authentication/authentication-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginModel: Taz.Model.View.ICredentials = {};
  registerModel: Taz.Model.View.IRegistration = {};

  constructor(
    private httpService: HttpService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() { }

  register() {
    this.registerModel.email = 'randy.w.lee@gmail.com';
    this.registerModel.firstName = 'Randy';
    this.registerModel.lastName = 'Lee';
    this.registerModel.location = 'Tallahassee, Florida';
    this.registerModel.password = 'tester';
    this.httpService.post<
      Taz.Model.View.IRegistration,
      Taz.Model.View.IStringResponse
      >(
        'api/account/register',
        this.registerModel,
        result => {
          console.log(result.data);
        },
        errors => {
          alert(errors);
        }
      );
  }

  login() {
    this.loginModel.userName = 'randy.w.lee@gmail.com';
    this.loginModel.password = 'tester';
    this.httpService.post<
      Taz.Model.View.ICredentials,
      Taz.Model.View.IAuthenticationTokenResponse
      >(
        'api/account/login',
        this.loginModel,
        result => {
          this.authenticationService.addToken(result.accessToken);
          console.log('Authentication Token = ' + result.accessToken);
        },
        errors => {
          alert(errors);
        }
      );
  }

  logout() {
    this.authenticationService.removeToken();
  }
}
