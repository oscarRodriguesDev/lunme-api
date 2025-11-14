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
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig; 

