import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ApplicationPaths } from "./api-authorization.constants";
import {
  RecaptchaLoaderService,
  RecaptchaSettings,
  RecaptchaV3Module,
  RECAPTCHA_V3_SITE_KEY,
} from "ng-recaptcha";
import { LoginComponent } from "./login/login.component";
import { AuthorizeGuard } from "./authorize.guard";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RecaptchaV3Module,
    RouterModule.forChild([
      { path: ApplicationPaths.Register, component: LoginComponent },
      { path: ApplicationPaths.Profile, component: LoginComponent },
      { path: ApplicationPaths.Login, component: LoginComponent },
      { path: ApplicationPaths.LoginFailed, component: LoginComponent },
      { path: ApplicationPaths.LoginCallback, component: LoginComponent },
      // { path: ApplicationPaths.LogOut, component: LogoutComponent },
      // { path: ApplicationPaths.LoggedOut, component: LogoutComponent },
      // { path: ApplicationPaths.LogOutCallback, component: LogoutComponent }
    ]),
  ],
  exports: [CommonModule],
  providers: [
    AuthorizeGuard,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: "xxx",
    },
    RecaptchaLoaderService,
  ],
})
export class ApiAuthorizationModule { }
