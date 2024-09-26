import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if (!req.url.includes('/login')) {
            const token = localStorage.getItem('authToken');
            if (token) {
                req = req.clone({
                    setHeaders: {
                    Authorization: `Bearer ${token}`,
                    },
                });
            }
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Erro na requisição:', error);
                return throwError(() => error);
            })
        );
    }

}
