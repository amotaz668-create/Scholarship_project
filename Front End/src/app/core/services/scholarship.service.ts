import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { expand, map, Observable, reduce } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api.models';
import {
  EligibilityPayload,
  Scholarship,
  ScholarshipFilters,
  ScholarshipPayload
} from '../models/scholarship.models';

@Injectable({ providedIn: 'root' })
export class ScholarshipService {
  private readonly http = inject(HttpClient);

  list(filters: ScholarshipFilters = {}): Observable<PaginatedResponse<Scholarship>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PaginatedResponse<Scholarship>>(`${environment.apiUrl}/scholarships`, { params });
  }

  /** Fetches every page while keeping the existing paginated API contract. */
  listAll(filters: ScholarshipFilters = {}): Observable<Scholarship[]> {
    const pageSize = 100;
    return this.list({ ...filters, page: 1, limit: pageSize }).pipe(
      expand((response) => response.pagination.page < response.pagination.totalPages
        ? this.list({ ...filters, page: response.pagination.page + 1, limit: pageSize })
        : []),
      map((response) => response.data),
      reduce((all, page) => [...all, ...page], [] as Scholarship[])
    );
  }

  getById(id: string): Observable<ApiResponse<Scholarship>> {
    return this.http.get<ApiResponse<Scholarship>>(`${environment.apiUrl}/scholarships/${id}`);
  }

  create(payload: ScholarshipPayload): Observable<ApiResponse<Scholarship>> {
    return this.http.post<ApiResponse<Scholarship>>(`${environment.apiUrl}/scholarships`, payload);
  }

  update(id: string, payload: Partial<ScholarshipPayload>): Observable<ApiResponse<Scholarship>> {
    return this.http.patch<ApiResponse<Scholarship>>(`${environment.apiUrl}/scholarships/${id}`, payload);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/scholarships/${id}`);
  }

  checkEligibility(payload: EligibilityPayload): Observable<ApiResponse<Scholarship[]>> {
    return this.http.post<ApiResponse<Scholarship[]>>(`${environment.apiUrl}/scholarships/check-eligibility`, payload);
  }
}
