import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.models';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = (route.data['roles'] ?? []) as UserRole[];
  const role = auth.role();
  if (role && allowed.includes(role)) return true;
  if (role) return router.parseUrl(auth.landingRouteFor(role));
  return router.parseUrl('/login');
};
