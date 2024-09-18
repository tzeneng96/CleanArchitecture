import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthorizeService } from "src/api-authorization/authorize.service";
import { UserModel } from "./web-api-client";

@Injectable()
export class UserDefaultRoute implements CanActivate {
  constructor(private authorize: AuthorizeService, private router: Router) { }

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authorize
      .getUser()
      .pipe(
        map((user: UserModel) =>
          this.handleDefaultRoute(_next, user != null, state)
        )
      );
  }

  private handleDefaultRoute(
    route: ActivatedRouteSnapshot,
    isAuthenticated: boolean,
    state: RouterStateSnapshot
  ): boolean {
    if (isAuthenticated) {
      this.router.navigate(["unauthorized"]);
    } else {
      this.router.navigate(["user"]);
    }
    return false;
  }
}
