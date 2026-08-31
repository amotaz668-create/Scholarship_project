import { Component, inject, signal } from '@angular/core';
import { NotificationItem } from '../../../core/models/notification.models';
import { NotificationService } from '../../../core/services/notification.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { NotificationItemComponent } from '../../../shared/components/notification-item/notification-item.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({ selector: 'app-notifications', standalone: true, imports: [NotificationItemComponent, UiStateComponent], template: `
  <section class="management-page notification-page"><header class="page-header split"><div><p class="eyebrow">JOURNEY UPDATES</p><h1>Notifications</h1><p>Status updates and important changes from the backend.</p></div><button class="button ghost" type="button" [disabled]="!unreadCount()" (click)="markAll()">Mark all as read</button></header>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    @if (loading()) { <div class="skeleton notification-skeleton"></div> } @else if (!notifications().length) { <app-ui-state icon="✦" title="You're all caught up" message="New application updates will appear here." /> } @else { <div class="notification-list">@for (item of notifications(); track item._id) { <app-notification-item [notification]="item" (markedRead)="markRead($event)" (removed)="remove($event)" /> }</div> }
  </section>` })
export class NotificationsComponent {
  private readonly api = inject(NotificationService); readonly loading = signal(true); readonly error = signal(''); readonly notifications = signal<NotificationItem[]>([]);
  constructor() { this.api.list().subscribe({ next: ({ notifications }) => { this.notifications.set(notifications); this.loading.set(false); }, error: (error: unknown) => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } }); }
  unreadCount(): number { return this.notifications().filter((item) => !item.isRead).length; }
  markRead(item: NotificationItem): void { this.api.markRead(item._id).subscribe({ next: ({ notification }) => this.notifications.update((items) => items.map((current) => current._id === notification._id ? notification : current)), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  markAll(): void { this.api.markAllRead().subscribe({ next: () => this.notifications.update((items) => items.map((item) => ({ ...item, isRead: true }))), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  remove(item: NotificationItem): void { this.api.delete(item._id).subscribe({ next: () => this.notifications.update((items) => items.filter((current) => current._id !== item._id)), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
}
