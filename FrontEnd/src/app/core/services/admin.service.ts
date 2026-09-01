import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { AdminLog, AdminStatistics, DashboardStatistics } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  dashboard(): Observable<ApiResponse<DashboardStatistics>> {
    return this.http.get<ApiResponse<DashboardStatistics>>(`${environment.apiUrl}/admin/dashboard`);
  }

  statistics(): Observable<ApiResponse<AdminStatistics>> {
    return this.http.get<ApiResponse<AdminStatistics>>(`${environment.apiUrl}/admin/statistics`);
  }

  logs(): Observable<{ success: boolean; logs: AdminLog[] }> {
    return this.http.get<{ success: boolean; logs: AdminLog[] }>(`${environment.apiUrl}/admin/logs`);
  }

  logById(id: string): Observable<{ success: boolean; log: AdminLog }> {
    return this.http.get<{ success: boolean; log: AdminLog }>(`${environment.apiUrl}/admin/logs/${id}`);
  }
}
