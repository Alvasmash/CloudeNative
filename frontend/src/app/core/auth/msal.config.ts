import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
  ProtectedResourceScopes
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
      clientId: environment.azure.clientId,
      authority: environment.azure.authority,
      redirectUri: environment.azure.redirectUri,
      postLogoutRedirectUri: environment.azure.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: environment.azure.loginScopes
    }
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();

  // Endpoints protegidos /api/** requieren el scope delegado configurado para la API
  // Ejemplo: http://localhost:8080/api/* -> ['api://pedidos360-api/recurso.write']
  protectedResourceMap.set(`${environment.apiUrl}/api/*`, [environment.azure.apiScope]);

  // Las rutas /public/** no requieren token ni intercepcion
  protectedResourceMap.set(`${environment.apiUrl}/public/*`, null);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}
