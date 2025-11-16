import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '', // Leave empty if no specific port is used
                pathname: '/**', // Matches any path on the hostname
            },
        ],
    },
};

export default nextConfig;
