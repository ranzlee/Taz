import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import { SecurityService } from '../../../services/security/security-service';
import { PolicyAuthorization } from '../../../services/security/policyAuthorization';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginModel: Taz.Model.View.Account.ICredentials = {};
  registerModel: Taz.Model.View.Account.IRegistration = {};

  private redirectRoute = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        const p = params.get('redirect');
        if (p != null) {
          return p;
        } else {
          return new BehaviorSubject<string>('');
        }
      })
      .subscribe(redirectRoute => {
        this.redirectRoute += redirectRoute;
      });
  }

  ngOnDestroy(): void {
    this.securityService.unsubscribe(this);
  }

  register() {
    this.registerModel.email = 'randy.w.lee@gmail.com';
    this.registerModel.firstName = 'Randy';
    this.registerModel.lastName = 'Lee';
    this.registerModel.location = 'Tallahassee, Florida';
    this.registerModel.password = 'tester';
    this.httpService.post<
      Taz.Model.View.Account.IRegistration,
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
      Taz.Model.View.Account.ICredentials,
      Taz.Model.Security.IAuthenticationTokenResponse
    >(
      'api/account/login',
      this.loginModel,
      result => {
        this.securityService.addToken(result.accessToken);
        console.log('Authentication Token = ' + result.accessToken);
        this.securityService.subscribe(this, policyAuthorizations => {
          this.router.navigateByUrl('/' + this.redirectRoute);
        });
      },
      errors => {
        alert(errors);
      }
    );
  }
}
