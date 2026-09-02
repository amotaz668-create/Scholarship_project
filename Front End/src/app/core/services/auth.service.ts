import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload, RegisterPayload, User, UserRole } from '../models/user.models';
import { ApiResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'scholarship_atlas_token';
  private readonly userKey = 'scholarship_atlas_user';

  readonly currentUser = signal<User | null>(this.readStoredUser());
  readonly isAuthenticated = computed(() => Boolean(this.token && this.currentUser()));
  readonly role = computed<UserRole | null>(() => this.currentUser()?.role ?? null);

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  register(payload: RegisterPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${environment.apiUrl}/auth/register`, payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  refreshUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout(): void {
    this.clearSession();
    void this.router.navigateByUrl('/');
  }

  expireSession(): void {
    this.clearSession();
    void this.router.navigate(['/login'], { queryParams: { session: 'expired' } });
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  landingRouteFor(role: UserRole): string {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'employee') return '/employee/dashboard';
    return '/dashboard';
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.data));
    this.currentUser.set(response.data);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
