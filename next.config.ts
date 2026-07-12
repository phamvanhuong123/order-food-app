import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
        
        
      },{
        protocol : 'https',
        hostname  : 'via.placeholder.com',
        port : '',
        pathname : '/**'
      }
    ],
    qualities : [75,100],
    dangerouslyAllowLocalIP : true
  },
};

export default nextConfig;
