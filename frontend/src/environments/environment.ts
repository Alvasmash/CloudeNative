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
    clientId: 'TU_AZURE_CLIENT_ID_PLACEHOLDER',
    // Tenant ID (Directory ID) de tu suscripcion de Microsoft Azure
    tenantId: 'TU_AZURE_TENANT_ID_PLACEHOLDER',
    // URI de redireccion configurada como Single-Page Application (SPA) en Azure
    redirectUri: 'http://localhost:4200',
    // Authority de Microsoft Entra ID (usa el tenantId o 'common')
    authority: 'https://login.microsoftonline.com/common',
    // Scope delegado expuesto por el backend para crear pedidos
    apiScope: 'api://pedidos360-api/recurso.write',
    // Scopes solicitados en el login basico
    loginScopes: ['openid', 'profile', 'email']
  },
  // Permite evaluar y alternar roles (ADMIN / CLIENTE) incluso sin tenant activo de Azure
  demoMode: true
};
