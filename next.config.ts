import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['cosplayin.agmerrizky.space'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cosplayin-api.agmerrizky.space",
        pathname: "/api/uploads/posts/media/**",
      },
    ],
  },
};

export default nextConfig;
