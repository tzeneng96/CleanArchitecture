import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from './authorize.service';
import { map, tap } from 'rxjs/operators';
import { ApplicationPaths, QueryParameterNames } from './api-authorization.constants';
import { UserModel } from '../app/web-api-client';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(private authorize: AuthorizeService, private router: Router) {
  }
  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authorize.getUser()
      .pipe(
        map(user => this.handleAuthorization(_next, user != null, state, user))
      );
  }

  private handleAuthorization(route: ActivatedRouteSnapshot, isAuthenticated: boolean, state: RouterStateSnapshot, user: UserModel): boolean {
    let canActivate = false;
    if (!isAuthenticated) {
      this.router.navigate(ApplicationPaths.LoginPathComponents, {
        queryParams: {
          [QueryParameterNames.ReturnUrl]: state.url
        }
      });
      canActivate = true;
      return canActivate;
    } else {
      const roleName = user.role;
      if (roleName == 'Administrator') {
        return true;
      }

      const permission = route.data['permission'];
      if (permission !== undefined) {
        if (permission.role !== undefined && permission.role.length) {
          // const currentRole = isAdmin && group === 2 ? 'ClientAdmin' : isAdmin && group === 3 ? 'ClinicAdmin' : 'Normal';
          // canActivate = permission.role.includes(currentRole);
          if (permission.role.includes('All')) {
            canActivate = true;
          }
          else {
            canActivate = permission.role.includes(roleName);
          }

          if (!canActivate) {
            this.router.navigate(['/unauthorized']);
          }
        } else {
          this.router.navigate(['/unauthorized']);
        }
      } else {
        this.router.navigate(['/unauthorized']);
      }

      return canActivate;
    }
  }
}
