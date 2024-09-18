import { Component, NgZone } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoginModel, UserModel } from '../../app/web-api-client';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../authorize.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

interface INavigationState {
  ["returnUrl"]: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;
  isResolved = false;
  loginFormGroup: UntypedFormGroup;
  login: LoginModel = new LoginModel();
  user: UserModel = null;
  version: string = require("../../../package.json").version;
  year: number;
  externalLogin = true;

  environment: string;
  recaptchaSubscription: Subscription;
  now = new Date();

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AuthorizeService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ngZone: NgZone
  ) {

    this.loginFormGroup = this._formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false],
    });
    this.year = new Date().getFullYear();
  }

  ngAfterViewInit(): void {
  }


  performLogin(): void {

    this.login.email = this.loginFormGroup.controls.email.value;
    this.login.password = this.loginFormGroup.controls.password.value;

    this.loading = true;
    this.accountService.signIn(this.login).subscribe(
      (res: UserModel) => {
        this.loading = false;
        this.user = res;
        this.accountService.saveUserInfo(
          res,
          this.loginFormGroup.controls.rememberMe.value
        );
        this.navigateToReturnUrl();
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  private getReturnUrl(): string {
    const fromQuery = (
      this.activatedRoute.snapshot.queryParams as INavigationState
    ).returnUrl;
    // If the url is comming from the query string, check that is either
    // a relative url or an absolute url
    if (
      fromQuery &&
      !(
        fromQuery.startsWith(`${window.location.origin}/`) ||
        /\/[^\/].*/.test(fromQuery)
      )
    ) {
      // This is an extra check to prevent open redirects.
      // throw new Error('Invalid return url. The return url needs to have the same origin as the current page.');
    }
    return fromQuery || "/";
  }

  private async navigateToReturnUrl() {
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    await this.router.navigateByUrl(this.getReturnUrl(), {
      replaceUrl: true,
    });
  }

  resolved($event) {
    this.isResolved = true;
  }

  validateCaptcha() {
    this.recaptchaSubscription = this.recaptchaV3Service
      .execute("loginAction")
      .subscribe(
        (token) => {
          this.performLogin();
          this.recaptchaSubscription.unsubscribe();
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
