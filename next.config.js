if (process.env.NODE_ENV === 'production') {
    process.env.DEBUG = '*';
    process.env.DEBUG_HIDE_DATE = 'true';
    process.env.DEBUG_DEPTH = '3';
    process.env.DEBUG_SHOW_HIDDEN = 'true';
}


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

    staticPageGenerationTimeout: 600,

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
