import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  if (!token) return next(request);
  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })
  ).pipe(
    catchError((error: unknown) => {
      if (typeof error === 'object' && error !== null && 'status' in error && error.status === 401) {
        auth.expireSession();
      }
      return throwError(() => error);
    })
  );
};
