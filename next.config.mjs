/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qfpygaqyldmthqakmisq.supabase.co",
        pathname: "/storage/v1/object/public/tiviai-images/**",
      },
    ],
  },

  experimental: {
    // 🔥 permite usar Node.js runtime no middleware
   // nodeMiddleware: true,

    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Necessário para Prisma na Vercel/production
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**/*"],
    "/api/**": ["./node_modules/.prisma/client/**/*"],
  },
};

export default nextConfig;
