import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'www.recoards.com' }],
        destination: 'https://recoards.com/:1',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
