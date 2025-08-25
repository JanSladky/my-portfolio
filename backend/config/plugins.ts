// backend/config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 10000000, // 10 MB (nebo podle potřeby)
      },
    },
  },
});