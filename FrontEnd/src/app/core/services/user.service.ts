import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ListResponse } from '../models/api.models';
import { ChangePasswordPayload, User, UserRole } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getMe(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/me`);
  }

  updateMe(payload: Partial<Pick<User, 'name' | 'email'>>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${environment.apiUrl}/users/me`, payload);
  }

  changePassword(payload: ChangePasswordPayload): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(`${environment.apiUrl}/users/me/password`, payload);
  }

  getAll(filters: { role?: UserRole; isActive?: boolean; search?: string } = {}): Observable<ListResponse<User>> {
    let params = new HttpParams();
    if (filters.role) params = params.set('role', filters.role);
    if (filters.isActive !== undefined) params = params.set('isActive', String(filters.isActive));
    if (filters.search) params = params.set('search', filters.search);
    return this.http.get<ListResponse<User>>(`${environment.apiUrl}/users`, { params });
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/${id}`);
  }

  update(id: string, payload: Partial<User> & { password?: string }): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${environment.apiUrl}/users/${id}`, payload);
  }

  createStaff(payload: { name: string; email: string; password: string; role: 'employee' | 'admin' }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${environment.apiUrl}/users/staff`, payload);
  }

  changeStatus(id: string, isActive: boolean): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${environment.apiUrl}/users/${id}/status`, { isActive });
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.apiUrl}/users/${id}`);
  }
}
