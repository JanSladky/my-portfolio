/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WORDPRESS_API: 'https://primary-production-c9043.up.railway.app/wp-json/wp/v2/pages',
    MYSQL_URL: 'mysql://root:bSmBqCloVohsUEIlOWwSlCwYayZKDRHe@nozomi.proxy.rlwy.net:38994/railway',
  },
};

module.exports = nextConfig;
