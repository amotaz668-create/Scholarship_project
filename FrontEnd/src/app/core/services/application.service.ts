import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ListResponse } from '../models/api.models';
import { ApplicationStatus, CreateApplicationPayload, ScholarshipApplication } from '../models/application.models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly http = inject(HttpClient);

  create(payload: CreateApplicationPayload): Observable<ApiResponse<ScholarshipApplication>> {
    return this.http.post<ApiResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications`, payload);
  }

  myApplications(): Observable<ListResponse<ScholarshipApplication>> {
    return this.http.get<ListResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/my`);
  }

  allApplications(): Observable<ListResponse<ScholarshipApplication>> {
    return this.http.get<ListResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications`);
  }

  getById(id: string): Observable<ApiResponse<ScholarshipApplication>> {
    return this.http.get<ApiResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/${id}`);
  }

  update(id: string, payload: Partial<CreateApplicationPayload>): Observable<ApiResponse<ScholarshipApplication>> {
    return this.http.patch<ApiResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/${id}`, payload);
  }

  submit(id: string): Observable<ApiResponse<ScholarshipApplication>> {
    return this.http.patch<ApiResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/${id}/submit`, {});
  }

  withdraw(id: string): Observable<ApiResponse<ScholarshipApplication>> {
    return this.http.patch<ApiResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/${id}/withdraw`, {});
  }

  updateStatus(id: string, status: ApplicationStatus, note: string): Observable<ApiResponse<ScholarshipApplication>> {
    return this.http.patch<ApiResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/${id}/status`, { status, note });
  }
}
