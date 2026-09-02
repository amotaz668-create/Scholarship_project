import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ListResponse } from '../models/api.models';
import { StudentDocument } from '../models/notification.models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly http = inject(HttpClient);

  list(): Observable<ListResponse<StudentDocument>> {
    return this.http.get<ListResponse<StudentDocument>>(`${environment.apiUrl}/student/documents`);
  }

  upload(type: string, file: File): Observable<ApiResponse<StudentDocument>> {
    const body = new FormData();
    body.append('type', type);
    body.append('file', file);
    return this.http.post<ApiResponse<StudentDocument>>(`${environment.apiUrl}/student/documents`, body);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.apiUrl}/student/documents/${id}`);
  }

  view(id: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/student/documents/${id}/file`, { responseType: 'blob' });
  }
}
