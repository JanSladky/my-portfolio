// backend/config/plugins.ts
export default () => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {},               // držíme prázdné, ať má Strapi očekávaný tvar
      sizeLimit: 50 * 1024 * 1024,       // 50 MB / soubor
      breakpoints: null,                 // bez automatických variant
      // baseUrl zde NEDÁVAT – Strapi použije server.url
    },
  },
});