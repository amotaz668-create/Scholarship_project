import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationItem } from '../models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);

  list(): Observable<{ success: boolean; notifications: NotificationItem[] }> {
    return this.http.get<{ success: boolean; notifications: NotificationItem[] }>(`${environment.apiUrl}/notifications`);
  }

  markRead(id: string): Observable<{ success: boolean; notification: NotificationItem }> {
    return this.http.patch<{ success: boolean; notification: NotificationItem }>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }

  markAllRead(): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(`${environment.apiUrl}/notifications/read-all`, {});
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.apiUrl}/notifications/${id}`);
  }
}
