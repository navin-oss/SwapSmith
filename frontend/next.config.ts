import type { NextConfig } from "next";
import path from "path";

<<<<<<< HEAD
// Check if we are building on Vercel
const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  // Only use standalone mode when NOT on Vercel
  output: isVercel ? undefined : "standalone",
=======
const nextConfig: NextConfig = {
  output: "standalone",
>>>>>>> 941ae72
  
  // Enable compilation for the shared folder
  transpilePackages: ['@swapsmith/shared'],
  
<<<<<<< HEAD
  // Only set custom tracing root when NOT on Vercel
  ...(isVercel ? {} : { outputFileTracingRoot: path.join(process.cwd(), '../') }),

  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

=======
  // Correctly trace files from the monorepo root (one level up)
  // This works dynamically for both Local (Windows/Mac) and Docker
  outputFileTracingRoot: path.join(process.cwd(), '../'),

  // Leave empty to use defaults, or configure if needed
>>>>>>> 941ae72
  turbopack: {}
};

export default nextConfig;