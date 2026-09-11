import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si estamos en modo demo y hay un usuario logueado en la sesion local,
  // aseguramos que viaje una cabecera Authorization para que el backend o proxies no la descarten
  let modifiedReq = req;
  if (authService.isDemoMode() && authService.isAuthenticated() && !req.headers.has('Authorization')) {
    const demoToken = authService.isAdmin() ? 'demo-admin-token' : 'demo-user-token';
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${demoToken}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';

      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor backend (puerto 8080). Verifica que el servicio Spring Boot esté en ejecución.';
        toastService.error(errorMessage, 'Fallo de Conexión');
      } else if (error.status === 401) {
        errorMessage = 'Tu sesión ha expirado o el token de Azure AD no es válido. Por favor, inicia sesión nuevamente.';
        toastService.warning(errorMessage, '401 No Autorizado');
        authService.logout();
      } else if (error.status === 403) {
        errorMessage = error.error?.message || 'Acceso denegado: No cuentas con el rol o permiso (scope) necesario para esta operación.';
        toastService.error(errorMessage, '403 Prohibido');
      } else if (error.status === 404) {
        errorMessage = error.error?.message || 'El recurso solicitado no fue encontrado.';
        toastService.warning(errorMessage, '404 No Encontrado');
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Los datos enviados no son válidos.';
        toastService.warning(errorMessage, 'Solicitud Incorrecta');
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'Conflicto en la operación.';
        toastService.warning(errorMessage, 'Conflicto');
      } else if (error.status >= 500) {
        errorMessage = 'Error interno en el servidor. Por favor, contacta a soporte técnico.';
        toastService.error(errorMessage, '500 Error de Servidor');
      }

      return throwError(() => error);
    })
  );
};
