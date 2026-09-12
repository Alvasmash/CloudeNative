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

    provideAppInitializer(() => {
      const msalInstance = inject(MSAL_INSTANCE);

      return msalInstance.initialize();
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
