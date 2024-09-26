// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isAuthenticated = this.authService.isAuthenticated();
    
        // If user is authenticated and trying to access login, redirect to /users
        if (isAuthenticated && state.url === '/') {
          this.router.navigate(['/users']);
          return false;
        }
    
        // Allow access if authenticated or if trying to access a public route
        if (isAuthenticated || state.url === '/') {
          return true;
        } else {
          // If not authenticated, redirect to login
          this.router.navigate(['/']);
          return false;
        }
      }

}
