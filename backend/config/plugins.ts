// backend/config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {},
      sizeLimit: 50 * 1024 * 1024, // 50 MB per file
      breakpoints: null,
      // URL, kterou Strapi vrací u souborů (bez trailing /)
      baseUrl: env('PUBLIC_URL', 'https://strapi-production-d581.up.railway.app'),
    },
  },
});