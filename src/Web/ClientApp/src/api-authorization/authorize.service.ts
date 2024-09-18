import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ApplicationPaths } from "./api-authorization.constants";
import { AuthenticationClient, LoginModel, UserModel } from "../app/web-api-client";
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: "root"
})

export class AuthorizeService {
  key = "encrypt!135790";
  cryptoJS: any;
  constructor(private authenticationService: AuthenticationClient,
    private router: Router) { }

  public getAccessToken(): Observable<string> {
    return new Observable(observer => {
      let accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        observer.next(accessToken);
      } else {
        observer.next(null);
      }
      observer.complete()
    });
  }

  getUser(): Observable<UserModel> {
    return new Observable(observer => {
      try {
        const cipherFromLocal = localStorage.getItem('currentUser');
        const bytes: any = this.cryptoJS.AES.decrypt(cipherFromLocal, this.key);
        const plaintext: string = bytes.toString(this.cryptoJS.enc.Utf8);
        const dectypttext = JSON.parse(plaintext);
        if (dectypttext) {
          observer.next(dectypttext);
        } else {
          observer.next(null);
        }
      } catch (e) {
        observer.next(null);
      }
    });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(map(u => !!u));
  }

  signIn(loginModel: LoginModel): Observable<UserModel> {
    return this.authenticationService.authentication_Login(loginModel);
  }

  signOut() {
    try {
      this.authenticationService.authentication_Logout().subscribe(res => { });
    } catch (err) {
    }

    localStorage.clear();
    this.router.navigate([ApplicationPaths.Login]);
  }

  public saveUserInfo(res: UserModel, rememberMe: boolean) {
    try {
      const userprofile: string = JSON.stringify(res);
      let ciphertext = this.cryptoJS.AES.encrypt(userprofile, this.key);
      localStorage.setItem('currentUser', ciphertext);
      localStorage.setItem('tokenValidity', new Date().getTime().toString());
      localStorage.setItem('rememberMe', rememberMe == true ? 'yes' : 'no');
    } catch (err) {
    }
  }

}
