export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      sizeLimit: 50 * 1024 * 1024, // 50 MB / soubor
      // !!! Důležité: breakpoints nenechávej null.
      // Buď to smaž, nebo nech prázdný objekt:
      breakpoints: {},

      // žádný baseUrl – Strapi použije server.url (PUBLIC_URL)
    },
  },
});