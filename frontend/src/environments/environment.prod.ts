/**
 * Variables de entorno para Produccion
 */
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  azure: {
    clientId: 'TU_AZURE_CLIENT_ID_PLACEHOLDER',
    tenantId: 'TU_AZURE_TENANT_ID_PLACEHOLDER',
    redirectUri: 'https://tudominio.com',
    authority: 'https://login.microsoftonline.com/TU_AZURE_TENANT_ID_PLACEHOLDER',
    apiScope: 'api://pedidos360-api/recurso.write',
    loginScopes: ['openid', 'profile', 'email']
  },
  demoMode: false
};
