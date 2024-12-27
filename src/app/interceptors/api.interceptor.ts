import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiUrl = 'http://localhost:8080';
    const apiReq = req.clone({
      url: req.url.startsWith('http') ? req.url : `${apiUrl}${req.url}`,
    });
    return next.handle(apiReq);
  }
}
