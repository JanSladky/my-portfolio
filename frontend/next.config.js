/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // DEV – Strapi lokálně
      { protocol: 'http', hostname: 'localhost', port: '1337' },
      // PROD – Strapi na Railway
      { protocol: 'https', hostname: 'strapi-production-d581.up.railway.app' },
    ],
  },

  env: {
    // používej to v klientu na skládání absolutních URL
    NEXT_PUBLIC_STRAPI_URL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:1337'
      : 'https://strapi-production-d581.up.railway.app',
  },
};

module.exports = nextConfig;