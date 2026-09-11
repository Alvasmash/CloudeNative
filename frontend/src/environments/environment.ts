/**
 * Variables de entorno para Desarrollo
 * Reemplaza los placeholders con los valores de tu App Registration en Microsoft Entra ID (Azure AD).
 */
export const environment = {
  production: false,
  // URL base de la API Spring Boot (o AWS API Gateway si aplica)
  apiUrl: 'http://localhost:8080',
  azure: {
    // Client ID / Application ID registrado en Azure Portal para la SPA
    clientId: 'c1ceeea6-1f0a-46ba-b79d-ed659608feef',
    // Tenant ID (Directory ID) de tu suscripcion de Microsoft Azure
    tenantId: '16c2a7cf-f000-475f-a847-f95ee0b36404',
    // URI de redireccion configurada como Single-Page Application (SPA) en Azure
    redirectUri: 'http://localhost:4200/redirect',
    // Authority de Microsoft Entra ID (usa el tenantId o 'common')
    authority: 'https://login.microsoftonline.com/16c2a7cf-f000-475f-a847-f95ee0b36404',
    // Scope delegado expuesto por el backend para crear pedidos
    apiScope: 'api://aef48164-1df8-49e6-b9f2-c1d8953ea200/recurso.write',
    // Scopes solicitados en el login basico
    loginScopes: ['openid', 'profile', 'email']
  },
  // Permite evaluar y alternar roles (ADMIN / CLIENTE) incluso sin tenant activo de Azure
  demoMode: true
};
