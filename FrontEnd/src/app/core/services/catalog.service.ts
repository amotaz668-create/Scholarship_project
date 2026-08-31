import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ReferenceItem } from '../models/api.models';

export interface CatalogBundle {
  categories: ReferenceItem[];
  countries: ReferenceItem[];
  universities: ReferenceItem[];
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  loadAll(): Observable<{ categories: ApiResponse<ReferenceItem[]>; countries: ApiResponse<ReferenceItem[]>; universities: ApiResponse<ReferenceItem[]> }> {
    return forkJoin({
      categories: this.list('categories'),
      countries: this.list('countries'),
      universities: this.list('universities')
    });
  }

  list(resource: 'categories' | 'countries' | 'universities'): Observable<ApiResponse<ReferenceItem[]>> {
    return this.http.get<ApiResponse<ReferenceItem[]>>(`${environment.apiUrl}/${resource}`);
  }

  create(resource: 'categories' | 'countries' | 'universities', payload: Record<string, unknown>): Observable<ApiResponse<ReferenceItem>> {
    return this.http.post<ApiResponse<ReferenceItem>>(`${environment.apiUrl}/${resource}`, payload);
  }

  update(resource: 'categories' | 'countries' | 'universities', id: string, payload: Record<string, unknown>): Observable<ApiResponse<ReferenceItem>> {
    return this.http.patch<ApiResponse<ReferenceItem>>(`${environment.apiUrl}/${resource}/${id}`, payload);
  }

  delete(resource: 'categories' | 'countries' | 'universities', id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/${resource}/${id}`);
  }
}
