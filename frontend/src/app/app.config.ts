import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
} from '@angular/core';

import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
} from '@azure/msal-angular';

import { routes } from './app.routes';

import { errorInterceptor } from './core/interceptors/error.interceptor';

import {
  MSALInstanceFactory,
  MSALGuardConfigFactory,
  MSALInterceptorConfigFactory,
  AUTH_ERROR_STORAGE_KEY,
} from './core/auth/msal.config';

export const appConfig: ApplicationConfig = {
  providers: [
    // ============================================================
    // Angular
    // ============================================================

    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideRouter(routes, withComponentInputBinding()),

    // ============================================================
    // HTTP
    // ============================================================

    provideHttpClient(
      withInterceptors([errorInterceptor]),
      withInterceptorsFromDi(),
    ),

    // ============================================================
    // MSAL INTERCEPTOR
    // ============================================================

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },

    // ============================================================
    // INSTANCIA MSAL
    // ============================================================

    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },

    // ============================================================
    // IMPORTANTE:
    // Inicializar MSAL antes de utilizar getActiveAccount(),
    // getAllAccounts(), loginPopup(), etc.
    // ============================================================

    provideAppInitializer(async () => {
      const msalInstance = inject(MSAL_INSTANCE);

      await msalInstance.initialize();

      /*
       * La ruta /redirect es el Redirect Bridge: solo reenvía la respuesta
       * de Microsoft a la página de origen. La respuesta se procesa allí,
       * no en el bridge.
       */
      if (window.location.pathname.endsWith('/redirect')) {
        return;
      }

      // Procesa el retorno de loginRedirect() / acquireTokenRedirect()
      try {
        const result = await msalInstance.handleRedirectPromise();

        if (result?.account) {
          msalInstance.setActiveAccount(result.account);
        }
      } catch (error: any) {
        console.error('Error procesando el retorno de Microsoft:', error);

        sessionStorage.setItem(
          AUTH_ERROR_STORAGE_KEY,
          error?.errorMessage || error?.message || 'Error de autenticación',
        );
      }
    }),

    // ============================================================
    // CONFIGURACIÓN DEL GUARD
    // ============================================================

    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },

    // ============================================================
    // CONFIGURACIÓN DEL INTERCEPTOR
    // ============================================================

    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },

    // ============================================================
    // SERVICIOS MSAL
    // ============================================================

    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
