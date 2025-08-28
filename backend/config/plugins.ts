// backend/config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      sizeLimit: 50 * 1024 * 1024,
      breakpoints: {},   // ne null
    },
  },
});