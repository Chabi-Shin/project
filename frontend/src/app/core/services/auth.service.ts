// frontend/src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { apiEndpoint } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  onLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(apiEndpoint.AuthEndpoint.login, credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.tokenService.setToken(response.token);
          this.router.navigate(['/todo']); // Navigate to todo page
        }
      })
    );
  }

  onLogout() {
    this.http.post(`${apiEndpoint.AuthEndpoint.logout}`, '').subscribe({
      next: (response) => {
        this.tokenService.removeToken();
        this.router.navigate(['/']); // Navigate to login page
      },
      error: (err) => {
        // Handle the error if necessary
        console.error('Logout failed', err);
        // Optional: navigate to login page even if logout request fails
        this.router.navigate(['/']);
      }
    });
  }

  onRegister(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => {
        if (response.message === 'User created successfully') {
          this.router.navigate(['/login']); // Navigate to login page after successful registration
        }
      })
    );
  }
}






