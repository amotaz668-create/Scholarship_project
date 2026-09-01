import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/services/error-message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <a class="brand auth-brand" routerLink="/"><img src="/logo.png" alt="Scholarship Atlas" class="brand-logo" /><span class="brand-text">Scholarship Atlas</span></a>
      <section class="auth-visual">
        <div class="auth-compass"><span>✦</span></div>
        <p class="eyebrow">WELCOME BACK, TRAVELER</p>
        <h1>Your next opportunity is waiting.</h1>
        <p>Return to your Opportunity Passport and continue the journey.</p>
      </section>
      <section class="auth-panel">
        <div class="auth-card">
          <p class="eyebrow">SIGN IN</p>
          <h2>Open your passport</h2>
          <p class="muted">Use the account created by the Scholarship Atlas team.</p>

          @if (error()) { <div class="alert error">{{ error() }}</div> }
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label>Email address<input type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"></label>
            <label>Password
              <div class="password-field">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="current-password"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="showPassword.set(!showPassword())"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                  [attr.aria-pressed]="showPassword()"
                >
                  @if (showPassword()) {
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 9 4 10.5 8-0.5 1.4-1.4 2.7-2.5 3.8M6.2 6.2C4.4 7.5 3.2 9.2 1.5 12c1.5 4 5.3 8 10.5 8 1.7 0 3.2-.4 4.5-1"/>
                    </svg>
                  } @else {
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z"/>
                      <circle cx="12" cy="12" r="2.5"/>
                    </svg>
                  }
                </button>
              </div>
            </label>
            <button class="button primary wide" type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Opening passport…' : 'Sign in →' }}
            </button>
          </form>
          <p class="auth-switch">New to the Atlas? <a routerLink="/register">Start your journey</a></p>
        </div>
      </section>
    </main>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly showPassword = signal(false);
  readonly form = this.fb.nonNullable.group({
    email: [this.route.snapshot.queryParamMap.get('email') ?? '', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor() {
    if (this.route.snapshot.queryParamMap.get('session') === 'expired') {
      this.error.set('Your session expired. Sign in again to continue.');
    }
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (response) => {
        const requested = this.route.snapshot.queryParamMap.get('returnUrl');
        const safeRoute = requested?.startsWith('/') ? requested : this.auth.landingRouteFor(response.data.role);
        void this.router.navigateByUrl(safeRoute);
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Unable to sign in.'))
    });
  }
}
