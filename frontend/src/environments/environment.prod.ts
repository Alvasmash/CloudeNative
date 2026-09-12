export const environment = {
  production: true,

  apiUrl: 'https://jfbxfcaajg.execute-api.us-east-1.amazonaws.com',

  azure: {
    clientId: 'c1ceeea6-1f0a-46ba-b79d-ed659608feef',
    tenantId: '16c2a7cf-f000-475f-a847-f95ee0b36404',

    redirectUri: 'https://alvasmash.github.io/CloudeNative/redirect',

    authority:
      'https://login.microsoftonline.com/16c2a7cf-f000-475f-a847-f95ee0b36404/v2.0',

    apiScope: 'api://aef48164-1df8-49e6-b9f2-c1d8953ea200/recurso.write',

    loginScopes: ['openid', 'profile', 'email'],
  },

  demoMode: false,
};
