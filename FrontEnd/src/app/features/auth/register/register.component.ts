import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/services/error-message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page register-page">
      <a class="brand auth-brand" routerLink="/"><span class="brand-mark">SA</span><span><b>Scholarship</b><small>ATLAS</small></span></a>
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
            <label>Password<input type="password" formControlName="password" autocomplete="new-password" placeholder="Minimum 6 characters"></label>
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
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]]
  });

  submit(): void {
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
