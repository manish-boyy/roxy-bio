/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true, // Allow all domains implicitly or disable optimization to fix some GIF issues/external loading
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
            },
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
            },
            {
                protocol: 'https',
                hostname: 'media.discordapp.net',
            },
            {
                protocol: 'https',
                hostname: 'images-ext-1.discordapp.net',
            },
        ],
    },
};

export default nextConfig;
