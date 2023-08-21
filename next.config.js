
/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: true,
    reactStrictMode: true,

    /** @type {import('sass').Options} */
    sassOptions: {
        alertColor: true,
        style: 'compressed',
    },

    experimental: {
    },

    trailingSlash: true,

    output: 'export',

    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
    },

    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    },
};

export default nextConfig;
