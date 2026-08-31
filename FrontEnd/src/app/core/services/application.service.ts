import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ListResponse } from '../models/api.models';
import { ApplicationPreparation, ApplicationStatus, CreateApplicationPayload, ScholarshipApplication, UpdateApplicationPayload } from '../models/application.models';

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

  assignedApplications(): Observable<ListResponse<ScholarshipApplication>> {
    return this.http.get<ListResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/assigned/me`);
  }

  getById(id: string): Observable<ApiResponse<ScholarshipApplication>> {
    return this.http.get<ApiResponse<ScholarshipApplication>>(`${environment.apiUrl}/applications/${id}`);
  }

  prepare(id: string): Observable<ApiResponse<ApplicationPreparation>> {
    return this.http.get<ApiResponse<ApplicationPreparation>>(`${environment.apiUrl}/applications/${id}/prepare`);
  }

  update(id: string, payload: UpdateApplicationPayload): Observable<ApiResponse<ApplicationPreparation>> {
    return this.http.patch<ApiResponse<ApplicationPreparation>>(`${environment.apiUrl}/applications/${id}`, payload);
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
