import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { NotificationItem } from '../../../core/models/notification.models';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article [class.unread]="!notification().isRead">
      <span class="notification-mark">{{ notification().isRead ? '✓' : '•' }}</span>
      <div>
        <div class="notification-heading">
          <h3>{{ notification().title }}</h3>
          <time>{{ notification().createdAt | date:'medium' }}</time>
        </div>
        <p>{{ notification().message }}</p>
        <small>{{ notification().type.replaceAll('_', ' ') }}</small>
      </div>
      <div class="notification-actions">
        @if (!notification().isRead) {
          <button type="button" (click)="markedRead.emit(notification())">Mark read</button>
        }
        <button type="button" class="danger-link" (click)="removed.emit(notification())">Delete</button>
      </div>
    </article>
  `,
  styles: [':host { display: block; }']
})
export class NotificationItemComponent {
  readonly notification = input.required<NotificationItem>();
  readonly markedRead = output<NotificationItem>();
  readonly removed = output<NotificationItem>();
}
