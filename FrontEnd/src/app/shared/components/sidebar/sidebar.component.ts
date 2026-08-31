import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ThemeService } from '../../../core/services/theme.service';

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

      <div class="sidebar-preferences" aria-label="Language and theme controls">
        <button type="button" class="nav-preference" (click)="i18n.toggleLanguage()"><span aria-hidden="true">文</span><span>{{ i18n.language() === 'en' ? 'العربية' : 'English' }}</span></button>
        <button type="button" class="nav-preference" (click)="theme.toggle()"><span aria-hidden="true">{{ theme.theme() === 'dark' ? '☀' : '☾' }}</span><span>{{ theme.theme() === 'dark' ? 'Light' : 'Dark' }}</span></button>
      </div>

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
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  }
}
