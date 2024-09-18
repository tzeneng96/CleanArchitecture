import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class DataService {
  // Define the internal Subject we'll use to push the command count
  public pendingCommandsSubject = new Subject<number>();
  public pendingCommandCount = 0;

  // Provide the *public* Observable that clients can subscribe to
  public pendingCommands$: Observable<number>;

  constructor(public http: HttpClient) {
    this.pendingCommands$ = this.pendingCommandsSubject.asObservable();
  }

  createAuthorizationHeader(): string {
    var token = localStorage.getItem('token');
    return token ? token : '';
  }

  public getImage(url: string): Observable<any> {
    return Observable.create((observer: any) => {
      const req = new XMLHttpRequest();
      req.open('get', url);
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          observer.next(req.response);
          observer.complete();
        }
      };

      const token = localStorage.getItem('token');
      req.setRequestHeader('AccessToken', token);
      req.send();
    });
  }

  public get<T>(url: string, params?: any): Observable<T> {
    return this.http.get<T>(url, { params: this.buildUrlSearchParams(params), headers: { 'AccessToken': this.createAuthorizationHeader() } });
  }

  public getFile(url: string, params?: any) {
    return this.http.get(url, { responseType: 'blob' });
  }

  public getFull<T>(url: string): Observable<HttpResponse<T>> {
    return this.http.get<T>(url, { observe: 'response' });
  }

  public post<T>(url: string, data?: any, params?: any): Observable<T> {
    return this.http.post<T>(url, data, { headers: { 'AccessToken': this.createAuthorizationHeader() }, params: params });
  }

  public postFile(url: string, data?: any, params?: any) {
    return this.http.post(url, data, { headers: { 'AccessToken': this.createAuthorizationHeader() }, responseType: 'blob' });
  }

  public put<T>(url: string, data?: any, params?: any): Observable<T> {
    return this.http.put<T>(url, data, { headers: { 'AccessToken': this.createAuthorizationHeader() } });
  }

  public delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, { headers: { 'AccessToken': this.createAuthorizationHeader() } });
  }

  private buildUrlSearchParams(params: any): HttpParams {
    const searchParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        searchParams.append(key, params[key]);
      }
    }
    return searchParams;
  }
}
