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
  // allow images from supabase domain
  images: {
    domains: ['hopysfaxmcfxmdpclhwq.supabase.co'],
  },
};

export default nextConfig;
