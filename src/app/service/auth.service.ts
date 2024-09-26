import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    private apiUrl = 'http://localhost:8080/api';
    private tokenKey = 'authToken';
    private roleKey = 'role';

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<{ token: string }> {
        return this.http.post<{ token: string; profileType: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
        tap((response: { token: string; profileType: string}) => {
            this.setToken(response.token);
            this.setRole(response.profileType);
        }),
        catchError(this.handleError)
        );
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        return token !== null;
      }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    setRole(role: string): void {
        localStorage.setItem(this.roleKey, role)
    }

    getRole(): string | null {
        return localStorage.getItem(this.roleKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
    }

    isAdmin(): boolean {
        const userProfile = localStorage.getItem(this.roleKey);
        return userProfile === 'ROLE_ADMIN';
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Erro desconhecido!';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Erro: ${error.error.message}`;
        } else {
            errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

}
