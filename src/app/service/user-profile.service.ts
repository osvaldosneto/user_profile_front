import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserDTO } from '../models/user.dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserProfileService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}


  getUserProfiles(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    );
  }

  getUserProfileById(id: number): Observable<UserDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<UserDTO>(url).pipe(catchError(this.handleError));
  }

  createUserProfile(profile: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiUrl, profile).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfile(id: number, profile: UserDTO): Observable<UserDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<UserDTO>(url, profile).pipe(
      catchError(this.handleError)
    );
  }

  deleteUserProfile(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}