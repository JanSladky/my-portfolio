// backend/config/server.ts
export default ({ env }) => ({
  host: '0.0.0.0',
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL'),        // např. https://strapi-production-d581.up.railway.app (bez koncového /)
  proxy: true,                   // za proxy (Railway)
  app: { keys: env.array('APP_KEYS') },
  logger: { level: env('STRAPI_LOG_LEVEL', 'info') },
});