/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/drive',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
