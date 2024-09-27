import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserDTO } from '../models/user.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiUrl + 'users';

    constructor(private http: HttpClient) {}

    getUsers(): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(this.apiUrl)
        .pipe(
            catchError(this.handleError)
        );
    }

    editUser(user: UserDTO): Observable<UserDTO> {
        const url = `${this.apiUrl}/${user.id}`;
        return this.http.put<UserDTO>(url, user).pipe(
            catchError(this.handleError)
        );
    }

    createUser(user: UserDTO): Observable<UserDTO> {
        return this.http.post<UserDTO>(this.apiUrl, user).pipe(
            catchError(this.handleError)
        );
    }

    deleteUser(userId: number): Observable<void> {
        const url = `${this.apiUrl}/${userId}`;
        return this.http.delete<void>(url).pipe(
            catchError(this.handleError)
        );
    }

    getUserById(userId: number): Observable<UserDTO> {
        const url = `${this.apiUrl}/${userId}`;
        return this.http.get<UserDTO>(url).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error)
        return throwError(() => error);
    }

}
