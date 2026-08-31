import { HttpErrorResponse } from '@angular/common/http';
import { ApiFailure } from '../models/api.models';

export function apiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  const body = error.error as ApiFailure | string | null;
  if (typeof body === 'string' && body.trim()) return body;
  if (body && typeof body === 'object') {
    if (body.message) return body.message;
    if (body.error) return body.error;
    const first = body.errors?.[0];
    if (first?.message) return first.message;
    if (first?.msg) return first.msg;
  }
  return fallback;
}
