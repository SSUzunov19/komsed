import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Позволява dev достъп и през 127.0.0.1 (не само localhost)
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
