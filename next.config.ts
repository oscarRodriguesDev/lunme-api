import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qfpygaqyldmthqakmisq.supabase.co',
        pathname: "/storage/v1/object/public/tiviai-images/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // 🔥 FIX necessário para o Prisma no Vercel
  outputFileTracingIncludes: {
    // inclui os binários do Prisma no build
    "/*": ["./node_modules/.prisma/client/**/*"],
    "/api/**": ["./node_modules/.prisma/client/**/*"],
  },
};

export default nextConfig;

