import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { passwordMatchValidator } from '../../../core/validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page register-page">
      <a class="brand auth-brand" routerLink="/"><img src="/logo.png" alt="Scholarship Atlas" class="brand-logo" /><span class="brand-text">Scholarship Atlas</span></a>
      <section class="auth-visual">
        <div class="passport-preview">
          <small>OPPORTUNITY PASSPORT</small><b>Scholarship Atlas</b><span>EXPLORE · APPLY · STUDY</span>
        </div>
        <p class="eyebrow">YOUR JOURNEY STARTS HERE</p>
        <h1>One profile. A world of opportunity.</h1>
        <p>Create your student account and start building a reusable scholarship profile.</p>
      </section>
      <section class="auth-panel">
        <div class="auth-card">
          <p class="eyebrow">CREATE ACCOUNT</p>
          <h2>Get your passport</h2>
          <p class="muted">Registration creates a Student account. Staff roles are created by an Admin.</p>
          @if (error()) { <div class="alert error">{{ error() }}</div> }
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label>Full name<input formControlName="name" autocomplete="name" placeholder="Your full name"></label>
            <label>Email address<input type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"></label>
            <label>Password
              <div class="password-field">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="new-password"
                  placeholder="Minimum 6 characters"
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

            <label>Confirm password
              <div class="password-field">
                <input
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  autocomplete="new-password"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="showConfirmPassword.set(!showConfirmPassword())"
                  [attr.aria-label]="showConfirmPassword() ? 'Hide password' : 'Show password'"
                  [attr.aria-pressed]="showConfirmPassword()"
                >
                  @if (showConfirmPassword()) {
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
            @if (form.hasError('passwordMismatch') && (form.controls.confirmPassword.touched || submitted())) { <small class="validation-message">Passwords do not match.</small> }
            <button class="button primary wide" type="submit" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Creating passport…' : 'Create student account →' }}
            </button>
          </form>
          <p class="auth-switch">Already registered? <a routerLink="/login">Sign in</a></p>
        </div>
      </section>
    </main>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly error = signal('');
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]],
    confirmPassword: ['', [Validators.required, Validators.maxLength(128)]]
  }, { validators: passwordMatchValidator('password', 'confirmPassword') });

  submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    const payload = this.form.getRawValue();
    this.auth.register(payload).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => void this.router.navigate(['/login'], { queryParams: { email: payload.email } }),
      error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Unable to create your account.'))
    });
  }
}
