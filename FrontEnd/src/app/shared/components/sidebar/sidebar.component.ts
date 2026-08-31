import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="management-sidebar">
      <a class="brand" routerLink="/">
        <span class="brand-mark">SA</span>
        <span><b>Scholarship</b><small>ATLAS</small></span>
      </a>

      <div class="workspace-label">{{ role() === 'admin' ? 'ADMIN CONTROL' : 'EMPLOYEE DESK' }}</div>
      <nav>
        @if (role() === 'admin') {
          <a routerLink="/admin/dashboard" routerLinkActive="active">Overview</a>
          <a routerLink="/admin/scholarships" routerLinkActive="active">Scholarships</a>
          <a routerLink="/admin/applications" routerLinkActive="active">Applications</a>
          <a routerLink="/admin/users" routerLinkActive="active">Users</a>
          <a routerLink="/admin/statistics" routerLinkActive="active">Statistics</a>
          <a routerLink="/admin/logs" routerLinkActive="active">Admin logs</a>
          <a routerLink="/admin/notifications" routerLinkActive="active">Notifications</a>
        } @else {
          <a routerLink="/employee/dashboard" routerLinkActive="active">Overview</a>
          <a routerLink="/employee/scholarships" routerLinkActive="active">Scholarships</a>
          <a routerLink="/employee/applications" routerLinkActive="active">Application review</a>
          <a routerLink="/employee/notifications" routerLinkActive="active">Notifications</a>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="avatar">{{ initials(auth.currentUser()?.name ?? 'User') }}</div>
        <div><b>{{ auth.currentUser()?.name }}</b><small>{{ auth.currentUser()?.role }}</small></div>
        <button class="sidebar-signout" type="button" title="Sign out" (click)="auth.logout()"><span aria-hidden="true">↗</span><span>Sign out</span></button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  readonly role = input.required<'admin' | 'employee'>();
  readonly auth = inject(AuthService);

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  }
}
