import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rating-item.s3.amazonaws.com',
        pathname: '/**', // Matches any path under the bucket
      },
    ],
  },
};

export default nextConfig;
