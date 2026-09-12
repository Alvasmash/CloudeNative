import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';

import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
  ProtectedResourceScopes,
} from '@azure/msal-angular';

import { environment } from '../../../environments/environment';

export function loggerCallback(logLevel: LogLevel, message: string): void {
  if (logLevel === LogLevel.Error) {
    console.error('[MSAL]', message);
  } else if (logLevel === LogLevel.Warning) {
    console.warn('[MSAL]', message);
  }
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      // Client ID de la aplicación Angular "Pedidos360"
      clientId: environment.azure.clientId,

      // Tenant específico de Azure
      authority: environment.azure.authority,

      // http://localhost:4200/
      redirectUri: environment.azure.redirectUri,

      // Después de cerrar sesión
      postLogoutRedirectUri: environment.azure.redirectUri,
    },

    cache: {
      // Mantener la sesión en el navegador
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },

    system: {
      loggerOptions: {
        loggerCallback,

        logLevel: LogLevel.Warning,

        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    // El guard utilizará Redirect
    interactionType: InteractionType.Redirect,

    authRequest: {
      // Scope solicitado al iniciar sesión
      scopes: environment.azure.loginScopes,
    },
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<
    string,
    Array<string | ProtectedResourceScopes> | null
  >();

  /*
   * API protegida.
   *
   * Todas las llamadas:
   *
   * http://localhost:8080/api/*
   *
   * recibirán automáticamente el Access Token
   * correspondiente a:
   *
   * api://aef48164-1df8-49e6-b9f2-c1d8953ea200/recurso.write
   */
  protectedResourceMap.set(`${environment.apiUrl}/api/*`, [
    environment.azure.apiScope,
  ]);

  /*
   * Endpoints públicos.
   *
   * No se agrega Access Token.
   */
  protectedResourceMap.set(`${environment.apiUrl}/public/*`, null);

  return {
    // Las solicitudes protegidas utilizarán Redirect
    interactionType: InteractionType.Redirect,

    protectedResourceMap,
  };
}
