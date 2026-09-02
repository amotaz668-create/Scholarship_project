import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.models';
import { StudentProfile, StudentProfileResponse } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<ApiResponse<StudentProfileResponse>> {
    return this.http.get<ApiResponse<StudentProfileResponse>>(`${environment.apiUrl}/student/profile`);
  }

  createProfile(payload: StudentProfile): Observable<ApiResponse<StudentProfile>> {
    return this.http.post<ApiResponse<StudentProfile>>(`${environment.apiUrl}/student/profile`, payload);
  }

  updateProfile(payload: StudentProfile): Observable<ApiResponse<StudentProfile>> {
    return this.http.patch<ApiResponse<StudentProfile>>(`${environment.apiUrl}/student/profile`, payload);
  }
}
