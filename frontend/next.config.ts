import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   serverComponentsExternalPackages: ['argon2'],
  // },
  serverExternalPackages: ['argon2'],
};

export default nextConfig;
