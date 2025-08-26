// backend/config/server.ts
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),          // čti z HOST, jinak default
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),            // veřejná URL BEZ trailing `/` (fallback na prázdno)
  proxy: true,                           // Railway běží za proxy
  app: {
    keys: env.array('APP_KEYS'),         // už máš v Railway
  },
  logger: {
    level: env('STRAPI_LOG_LEVEL', 'info'),
  },
});