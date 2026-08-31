import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="atlas-nav">
      <a class="brand" routerLink="/" aria-label="Scholarship Atlas home">
        <span class="brand-mark">SA</span>
        <span><b>Scholarship</b><small>ATLAS</small></span>
      </a>

      <button class="mobile-toggle" type="button" (click)="menuOpen.set(!menuOpen())" aria-label="Toggle navigation"><span aria-hidden="true">☰</span><span>Menu</span></button>

      <nav [class.open]="menuOpen()" (click)="menuOpen.set(false)">
        <a routerLink="/explore" routerLinkActive="active">Explore</a>
        @if (auth.role() === 'student') {
          <a routerLink="/journey" routerLinkActive="active">My Journey</a>
          <a routerLink="/saved" routerLinkActive="active">Saved</a>
          <a routerLink="/notifications" routerLinkActive="active">Notifications</a>
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
        }
      </nav>

      <div class="nav-actions">
        <div class="nav-preferences" aria-label="Language and theme controls">
          <button type="button" class="nav-preference" (click)="i18n.toggleLanguage()" [attr.aria-label]="i18n.language() === 'en' ? 'العربية' : 'English'">
            <span aria-hidden="true">文</span><span>{{ i18n.language() === 'en' ? 'العربية' : 'English' }}</span>
          </button>
          <button type="button" class="nav-preference" (click)="theme.toggle()" [attr.aria-label]="theme.theme() === 'dark' ? 'Light' : 'Dark'">
            <span aria-hidden="true">{{ theme.theme() === 'dark' ? '☀' : '☾' }}</span><span>{{ theme.theme() === 'dark' ? 'Light' : 'Dark' }}</span>
          </button>
        </div>
        <div class="nav-auth-actions">
          @if (auth.currentUser(); as user) {
            <a class="user-chip" [routerLink]="auth.landingRouteFor(user.role)" [attr.aria-label]="user.name">{{ initials(user.name) }}</a>
            <button class="button ghost small" type="button" (click)="auth.logout()">Sign out</button>
          } @else {
            <a class="button ghost small" routerLink="/login">Sign in</a>
            <a class="button primary small" routerLink="/register">Start journey</a>
          }
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);
  readonly menuOpen = signal(false);

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  }
}
