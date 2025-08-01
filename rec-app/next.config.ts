import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'recoards.com' }],
        destination: 'https://www.recoards.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
