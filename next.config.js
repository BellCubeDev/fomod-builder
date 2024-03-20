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

    productionBrowserSourceMaps: true,

    /** @type {import('sass').Options} */
    sassOptions: {
        alertColor: true,
        style: 'compressed',
    },

    experimental: {
        turbo: {
            rules: { // load XSD files as strings
                '*.xsd': {
                    as: 'string',
                    loaders: ['raw-loader'],
                }
            },
        },
        esmExternals: 'loose',
    },

    staticPageGenerationTimeout: 600,

    transpilePackages: ['fomod'],

    trailingSlash: true,

    output: 'export',

    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
    },

    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true };

        // load XSD files as strings
        config.module.rules.push({
            test: /\.xsd$/,
            use: 'raw-loader',
        });

        return config;
    },
};

export default nextConfig;
