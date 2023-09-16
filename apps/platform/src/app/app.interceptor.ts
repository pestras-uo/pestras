/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionState } from '@pestras/frontend/state';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private session: SessionState) {}

  // getCookie(cname: string) {
  //   const name = cname + "=";
  //   const decodedCookie = decodeURIComponent(document.cookie);
  //   const ca = decodedCookie.split(';');

  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i];

  //     while (c.charAt(0) == ' ')
  //       c = c.substring(1);
      
  //     if (c.indexOf(name) == 0)
  //       return c.substring(name.length, c.length);
      
  //   }

  //   return "";
  // }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes("maps.googleapis.com/maps/api"))
      return next.handle(httpRequest);

    // const xsrf = this.getCookie('xsrf');
    const token = this.session.getToken();

    const req = httpRequest.clone({
      // withCredentials: true,
      // setHeaders: { 'x-xsrf-token': xsrf }
      setHeaders: { authorization: `bearer ${token}`}
    });
    
    return next.handle(req);
  }
}