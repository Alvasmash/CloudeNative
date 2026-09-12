import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (!authService.isAuthenticated()) {
    toastService.warning(
      'Debes iniciar sesión con rol de Administrador',
      'Acceso Requerido',
    );
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: '/admin' },
    });
  }

  if (authService.isAdmin()) {
    return true;
  }

  toastService.error(
    'No tienes permisos de Administrador (ROLE_ADMIN) para acceder a esta área',
    '403 Acceso Denegado',
  );
  return router.createUrlTree(['/menu']);
};
