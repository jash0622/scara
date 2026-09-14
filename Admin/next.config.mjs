/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // ensure Next.js picks up src/ directory
  },
  // Compress responses
  compress: true,
  // Standalone output — self-contained for EC2 deployment
  output: 'standalone',
  // Proxy /api/* calls to the backend — avoids CORS issues in development
  async rewrites() {
    const backendUrl = process.env.API_BASE_URL ?? "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "scara-media.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
