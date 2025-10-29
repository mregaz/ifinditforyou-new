import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // WWW → root (308)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ifinditforyou.com' }],
        destination: 'https://ifinditforyou.com/:path*',
        permanent: true, // 308
      },
      // HTTP → HTTPS (facoltativo ma consigliato)
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://ifinditforyou.com/:path*',
        permanent: true, // 308
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;

