// Configuracao de producao - Lavanderia Beltrao
// Suporta tanto IP quanto dominio (sera detectado automaticamente)
export const environment = {
  production: true,
  API: 'api/',
  backend: {
    // Usa a mesma origem do frontend (Apache faz proxy reverso para /api)
    baseUrl: window.location.origin + '/'
  }
};
