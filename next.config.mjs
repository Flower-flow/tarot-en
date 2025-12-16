/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.sacred-texts.com',
        pathname: '/tarot/pkt/img/**',
      },
    ],
  },
};

export default nextConfig;